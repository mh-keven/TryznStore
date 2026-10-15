/**
 * TRYZN STORE PAKISTAN — Google Apps Script API
 *
 * Keep this file in sync with the Apps Script project attached to the store spreadsheet.
 * Public actions: read active products/promos, submit checkout orders, upsert customer profiles.
 * Do NOT add public admin-write actions or store secrets in the website JavaScript.
 */

const TRZ_DATABASE = {
  Products: ["product_id","name","category","subcategory","price","old_price","rating","reviews","stock","badge","image","description","active","created_at","updated_at"],
  Orders: ["order_id","created_at","customer_id","customer_name","phone","email","city","address","items_json","subtotal","discount","shipping_fee","total","payment_method","status","tracking_number","notes","updated_at"],
  Customers: ["customer_id","created_at","full_name","email","phone","default_city","default_address","postal_code","active","updated_at"],
  PromoCodes: ["promo_code","discount_type","discount_value","min_order","max_discount","applicable_categories_json","applicable_product_ids_json","usage_limit","used_count","starts_at","expires_at","active","created_at","updated_at"],
  AdminLogs: ["log_id","timestamp","admin_identifier","action","entity_type","entity_id","details_json","result"]
};

function setupTryznDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Open Apps Script from the Tryzn Store spreadsheet first.");

  Object.keys(TRZ_DATABASE).forEach(function(name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    const headers = TRZ_DATABASE[name];

    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      // Do not overwrite existing data or reorder existing columns.
      const existing = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), headers.length)).getDisplayValues()[0];
      const existingNonEmpty = existing.filter(String);
      if (!existingNonEmpty.length) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    sh.getRange(1, 1, 1, headers.length)
      .setBackground("#1e293b").setFontColor("#ffffff").setFontWeight("bold")
      .setWrap(true).setVerticalAlignment("middle");
    sh.setFrozenRows(1);
    sh.setRowHeight(1, 36);
    if (!sh.getFilter()) sh.getRange(1, 1, sh.getMaxRows(), headers.length).createFilter();
  });

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("Tryzn Store database tabs checked. Existing data was preserved.");
}

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || "products").toLowerCase();
    if (action === "products") return jsonResponse_({success:true, products:readObjects_("Products")});
    if (action === "promocodes" || action === "promo-codes") {
      const promos = readObjects_("PromoCodes").map(function(p) {
        p.applicable_categories = parseJsonArray_(p.applicable_categories_json);
        p.applicable_product_ids = parseJsonArray_(p.applicable_product_ids_json);
        p.active = isTrue_(p.active);
        return p;
      });
      return jsonResponse_({success:true, promoCodes:promos});
    }
    return jsonResponse_({success:false,error:"Unsupported action."});
  } catch (err) {
    return jsonResponse_({success:false,error:String(err && err.message || err)});
  }
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) throw new Error("Missing request body.");
    const payload = JSON.parse(raw);
    const action = String(payload.action || "");

    if (action === "createOrder") return jsonResponse_(createOrder_(payload.order || {}));
    if (action === "upsertCustomer") return jsonResponse_(upsertCustomer_(payload.customer || {}));

    // Admin writes intentionally remain disabled until authenticated server-side.
    return jsonResponse_({success:false,error:"Unsupported or protected action."});
  } catch (err) {
    return jsonResponse_({success:false,error:String(err && err.message || err)});
  }
}

function createOrder_(o) {
  const name = clean_(o.customer_name, 120);
  const phone = clean_(o.phone, 40);
  const city = clean_(o.city, 80);
  const address = clean_(o.address, 600);
  const orderId = clean_(o.order_id, 40);
  const items = Array.isArray(o.items) ? o.items : [];

  if (name.length < 2 || phone.replace(/\D/g, "").length < 10 || !city || address.length < 5 || !items.length) {
    throw new Error("Order details are incomplete.");
  }
  if (!orderId) throw new Error("Order ID is required.");

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_("Orders");
    const existing = findRowByValue_(sh, "order_id", orderId);
    if (existing) return {success:true, order_id:orderId, duplicate:true};

    const now = new Date();
    const row = {
      order_id: orderId,
      created_at: now,
      customer_id: "",
      customer_name: name,
      phone: phone,
      email: clean_(o.email, 160),
      city: city,
      address: address,
      items_json: JSON.stringify(items.map(function(i) {
        return {id:clean_(i.id,80), name:clean_(i.name,160), qty:Math.max(1,Math.min(99,Number(i.qty)||1)), price:Math.max(0,Number(i.price)||0)};
      })),
      subtotal: Math.max(0, Number(o.subtotal)||0),
      discount: Math.max(0, Number(o.discount)||0),
      shipping_fee: Math.max(0, Number(o.shipping_fee)||0),
      total: Math.max(0, Number(o.total)||0),
      payment_method: clean_(o.payment_method || "Cash on Delivery", 60),
      status: "New",
      tracking_number: "",
      notes: clean_(o.notes, 500),
      updated_at: now
    };
    appendObject_("Orders", row);
    appendObject_("AdminLogs", {
      log_id: Utilities.getUuid(), timestamp: now, admin_identifier: "system",
      action: "order_created", entity_type: "order", entity_id: orderId,
      details_json: JSON.stringify({city:city, item_count:items.length}), result: "success"
    });
    return {success:true, order_id:orderId};
  } finally {
    lock.releaseLock();
  }
}

function upsertCustomer_(c) {
  const name = clean_(c.full_name, 120);
  const email = clean_(c.email, 160).toLowerCase();
  const phone = clean_(c.phone, 40);
  const city = clean_(c.default_city, 80);
  const address = clean_(c.default_address, 600);
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, "").length < 10 || !city) {
    throw new Error("Customer details are invalid.");
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_("Customers");
    const matchRow = findRowByValue_(sh, "email", email);
    const now = new Date();
    const customerId = matchRow ? String(valueAt_(sh, matchRow, "customer_id") || "") : "CUS-" + Utilities.getUuid().slice(0, 8).toUpperCase();
    const row = {
      customer_id: customerId,
      created_at: matchRow ? valueAt_(sh, matchRow, "created_at") : now,
      full_name: name, email: email, phone: phone,
      default_city: city, default_address: address,
      postal_code: "", active: c.active === false ? false : true, updated_at: now
    };
    if (matchRow) writeObjectAtRow_("Customers", matchRow, row);
    else appendObject_("Customers", row);

    appendObject_("AdminLogs", {
      log_id: Utilities.getUuid(), timestamp: now, admin_identifier: "system",
      action: matchRow ? "customer_updated" : "customer_created", entity_type: "customer",
      entity_id: customerId, details_json: JSON.stringify({email:email}), result: "success"
    });
    return {success:true, customer_id:customerId};
  } finally {
    lock.releaseLock();
  }
}

function readObjects_(name) {
  const sh = sheet_(name);
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];
  const values = sh.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = values[0].map(function(h){ return String(h).trim(); });
  return values.slice(1).filter(function(row){ return row.some(function(v){return v !== "" && v !== null;}); })
    .map(function(row) {
      const obj = {};
      headers.forEach(function(h, i) {
        if (!h) return;
        const v = row[i];
        obj[h] = v instanceof Date ? v.toISOString() : v;
      });
      return obj;
    });
}

function appendObject_(name, obj) {
  const sh = sheet_(name);
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(function(h){return String(h).trim();});
  sh.appendRow(headers.map(function(h){ return Object.prototype.hasOwnProperty.call(obj, h) ? obj[h] : ""; }));
}

function writeObjectAtRow_(name, rowNumber, obj) {
  const sh = sheet_(name);
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(function(h){return String(h).trim();});
  sh.getRange(rowNumber, 1, 1, headers.length).setValues([headers.map(function(h){return Object.prototype.hasOwnProperty.call(obj,h) ? obj[h] : valueAt_(sh,rowNumber,h);} )]);
}

function findRowByValue_(sh, headerName, wanted) {
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return 0;
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(function(h){return String(h).trim();});
  const col = headers.indexOf(headerName);
  if (col < 0) throw new Error('Missing column "' + headerName + '" in ' + sh.getName() + ".");
  const values = sh.getRange(2, col + 1, lastRow - 1, 1).getDisplayValues();
  for (let i = 0; i < values.length; i++) if (String(values[i][0]).trim().toLowerCase() === String(wanted).trim().toLowerCase()) return i + 2;
  return 0;
}

function valueAt_(sh, rowNumber, headerName) {
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(function(h){return String(h).trim();});
  const col = headers.indexOf(headerName);
  return col < 0 ? "" : sh.getRange(rowNumber, col + 1).getValue();
}

function sheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Spreadsheet is not available.");
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('The "' + name + '" tab was not found. Run setupTryznDatabase first.');
  return sh;
}

function parseJsonArray_(value) {
  if (Array.isArray(value)) return value;
  try { const parsed = JSON.parse(String(value || "[]")); return Array.isArray(parsed) ? parsed : []; }
  catch (err) { return String(value || "").split(",").map(function(s){return s.trim();}).filter(Boolean); }
}
function isTrue_(value) { return value === true || String(value).trim().toLowerCase() === "true" || String(value).trim() === "1"; }
function clean_(value, maxLen) { return String(value == null ? "" : value).replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, maxLen); }
function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function diagnoseTryznProducts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss && ss.getSheetByName("Products");
  if (!sh) { Logger.log('ERROR: "Products" sheet not found.'); return; }
  Logger.log("Spreadsheet: " + ss.getName());
  Logger.log("Sheet: " + sh.getName());
  Logger.log("Last row: " + sh.getLastRow());
  Logger.log("Headers: " + JSON.stringify(sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0]));
}
