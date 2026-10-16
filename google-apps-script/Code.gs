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

    // Admin email/password are checked server-side on sign-in and every protected request.
    if (action === "adminLogin") {
      const admin = verifyAdminPassword_(payload.email, payload.password);
      logAdminAction_(admin.email, "admin_sign_in", "admin", admin.email, {method:"email_password"}, "success");
      return jsonResponse_({success:true, admin:{email:admin.email}});
    }
    if (action === "adminGetOrders") {
      const admin = verifyAdminPassword_(payload.email, payload.password);
      return jsonResponse_({success:true, orders:readAdminOrders_(), admin_email:admin.email});
    }
    if (action === "adminGetProducts") {
      const admin = verifyAdminPassword_(payload.email, payload.password);
      return jsonResponse_({success:true, products:readObjects_("Products"), admin_email:admin.email});
    }
    if (action === "adminSaveProduct") {
      const admin = verifyAdminPassword_(payload.email, payload.password);
      return jsonResponse_(saveProduct_(admin, payload.product || {}));
    }
    if (action === "adminDeleteProduct") {
      const admin = verifyAdminPassword_(payload.email, payload.password);
      return jsonResponse_(deleteProduct_(admin, payload.product_id));
    }
    if (action === "adminSavePromoCode") {
      const admin = verifyAdminPassword_(payload.email, payload.password);
      return jsonResponse_(savePromoCode_(admin, payload.promo || {}));
    }
    if (action === "adminDeletePromoCode") {
      const admin = verifyAdminPassword_(payload.email, payload.password);
      return jsonResponse_(deletePromoCode_(admin, payload.promo_code));
    }
    if (action === "adminUpdateOrderStatus") {
      const admin = verifyAdminPassword_(payload.email, payload.password);
      return jsonResponse_(updateOrderStatus_(admin, payload.order_id, payload.status));
    }

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

function saveProduct_(admin, p) {
  const productId = clean_(p.product_id || p.id, 80);
  const name = clean_(p.name, 180);
  const category = clean_(p.category, 100);
  const image = clean_(p.image, 1800);
  const price = Number(p.price);
  if (!productId || name.length < 2 || !category || !Number.isFinite(price) || price <= 0) {
    throw new Error("Product ID, name, category, and a valid price are required.");
  }
  // Product media must be hosted at a URL; do not store large browser data URLs in Sheets.
  if (image && !/^https?:\/\//i.test(image)) {
    throw new Error("Use a public image URL for the product image. Uploaded local files cannot be stored in Google Sheets.");
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_("Products");
    const matchRow = findRowByValue_(sh, "product_id", productId);
    const now = new Date();
    const row = {
      product_id: productId,
      name: name,
      category: category,
      subcategory: clean_(p.subcategory, 100),
      price: price,
      old_price: Math.max(0, Number(p.old_price != null ? p.old_price : p.oldPrice) || 0),
      rating: Math.max(0, Math.min(5, Number(p.rating) || 5)),
      reviews: Math.max(0, Number(p.reviews) || 0),
      stock: Math.max(0, Math.floor(Number(p.stock) || 0)),
      badge: clean_(p.badge, 100),
      image: image,
      description: clean_(p.description, 2000),
      active: p.active === false ? false : true,
      created_at: matchRow ? valueAt_(sh, matchRow, "created_at") : now,
      updated_at: now
    };
    if (matchRow) writeObjectAtRow_("Products", matchRow, row);
    else appendObject_("Products", row);
    logAdminAction_(admin.email, matchRow ? "product_updated" : "product_created", "product", productId, {name:name, category:category}, "success");
    return {success:true, product_id:productId, updated:Boolean(matchRow)};
  } finally {
    lock.releaseLock();
  }
}

function deleteProduct_(admin, productIdValue) {
  const productId = clean_(productIdValue, 80);
  if (!productId) throw new Error("Product ID is required.");
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_("Products");
    const row = findRowByValue_(sh, "product_id", productId);
    if (!row) throw new Error("Product not found in Google Sheets.");
    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(function(h) { return String(h).trim(); });
    const activeCol = headers.indexOf("active") + 1;
    const updatedCol = headers.indexOf("updated_at") + 1;
    if (!activeCol) throw new Error('Missing "active" column in Products sheet.');
    sh.getRange(row, activeCol).setValue(false);
    if (updatedCol) sh.getRange(row, updatedCol).setValue(new Date());
    logAdminAction_(admin.email, "product_deactivated", "product", productId, {}, "success");
    return {success:true, product_id:productId, active:false};
  } finally {
    lock.releaseLock();
  }
}


function savePromoCode_(admin, p) {
  const code = clean_(p.promo_code || p.code, 24).toUpperCase().replace(/\\s+/g, "");
  const type = clean_(p.discount_type || "percentage", 30).toLowerCase();
  const discount = Number(p.discount_value != null ? p.discount_value : p.percent);
  if (!/^[A-Z0-9_-]{3,24}$/.test(code)) throw new Error("Promo code must contain 3–24 letters, numbers, hyphens or underscores.");
  if (type !== "percentage" || !Number.isFinite(discount) || discount < 1 || discount > 90) throw new Error("Only percentage discounts from 1% to 90% are supported.");
  const categories = Array.isArray(p.applicable_categories) ? p.applicable_categories : (p.category ? [p.category] : []);
  const productIds = Array.isArray(p.applicable_product_ids) ? p.applicable_product_ids : (p.product_id ? [p.product_id] : []);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = sheet_("PromoCodes");
    const matchRow = findRowByValue_(sh, "promo_code", code);
    const now = new Date();
    const row = {
      promo_code: code, discount_type: type, discount_value: discount,
      min_order: Math.max(0, Number(p.min_order) || 0), max_discount: Math.max(0, Number(p.max_discount) || 0),
      applicable_categories_json: JSON.stringify(categories.map(v => clean_(v, 100)).filter(Boolean)),
      applicable_product_ids_json: JSON.stringify(productIds.map(v => clean_(v, 80)).filter(Boolean)),
      usage_limit: Math.max(0, Math.floor(Number(p.usage_limit) || 0)),
      used_count: matchRow ? Math.max(0, Number(valueAt_(sh, matchRow, "used_count")) || 0) : Math.max(0, Math.floor(Number(p.used_count) || 0)),
      starts_at: clean_(p.starts_at, 50), expires_at: clean_(p.expires_at, 50), active: p.active === false ? false : true,
      created_at: matchRow ? valueAt_(sh, matchRow, "created_at") : now, updated_at: now
    };
    if (matchRow) writeObjectAtRow_("PromoCodes", matchRow, row); else appendObject_("PromoCodes", row);
    logAdminAction_(admin.email, matchRow ? "promo_code_updated" : "promo_code_created", "promo_code", code, {discount_value:discount}, "success");
    return {success:true, promo_code:code, updated:Boolean(matchRow)};
  } finally { lock.releaseLock(); }
}

function deletePromoCode_(admin, codeValue) {
  const code = clean_(codeValue, 24).toUpperCase();
  if (!code) throw new Error("Promo code is required.");
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = sheet_("PromoCodes");
    const row = findRowByValue_(sh, "promo_code", code);
    if (!row) throw new Error("Promo code was not found in Google Sheets.");
    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(h => String(h).trim());
    const activeCol = headers.indexOf("active") + 1;
    const updatedCol = headers.indexOf("updated_at") + 1;
    if (!activeCol) throw new Error('Missing "active" column in PromoCodes sheet.');
    sh.getRange(row, activeCol).setValue(false);
    if (updatedCol) sh.getRange(row, updatedCol).setValue(new Date());
    logAdminAction_(admin.email, "promo_code_deactivated", "promo_code", code, {}, "success");
    return {success:true, promo_code:code, active:false};
  } finally { lock.releaseLock(); }
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


/**
 * Admin credentials live only in Apps Script Project Settings > Script properties.
 * Required properties: ADMIN_EMAIL and ADMIN_PASSWORD.
 * The website never contains the admin password in its public source.
 */
function verifyAdminPassword_(emailValue, passwordValue) {
  const props = PropertiesService.getScriptProperties();
  const expectedEmail = clean_(props.getProperty("ADMIN_EMAIL"), 160).toLowerCase();
  const expectedPassword = String(props.getProperty("ADMIN_PASSWORD") || "");
  const email = clean_(emailValue, 160).toLowerCase();
  const password = String(passwordValue || "");

  if (!expectedEmail || !expectedPassword) {
    throw new Error("Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in Apps Script Script properties.");
  }
  if (!email || !password || email !== expectedEmail || password !== expectedPassword) {
    logAdminAction_(email || "unknown", "admin_sign_in_denied", "admin", email || "unknown", {}, "denied");
    throw new Error("Incorrect admin email or password.");
  }
  return {email:email};
}

function readAdminOrders_() {
  return readObjects_("Orders").map(function(row) {
    let items = [];
    try { items = JSON.parse(String(row.items_json || "[]")); } catch (err) {}
    if (!Array.isArray(items)) items = [];
    return {
      id: String(row.order_id || ""),
      time: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at || ""),
      customer_id: String(row.customer_id || ""),
      name: String(row.customer_name || ""),
      phone: String(row.phone || ""),
      email: String(row.email || ""),
      city: String(row.city || ""),
      address: String(row.address || ""),
      items: items,
      subtotal: Number(row.subtotal) || 0,
      discount: Number(row.discount) || 0,
      shipping: Number(row.shipping_fee) || 0,
      total: Number(row.total) || 0,
      status: String(row.status || "New"),
      tracking_number: String(row.tracking_number || ""),
      notes: String(row.notes || "")
    };
  }).filter(function(order) { return order.id; }).reverse();
}

function updateOrderStatus_(admin, orderIdValue, statusValue) {
  const orderId = clean_(orderIdValue, 80);
  const status = clean_(statusValue, 40);
  const allowedStatuses = ["New", "Confirmed", "Dispatched", "Delivered", "Cancelled"];
  if (!orderId || allowedStatuses.indexOf(status) === -1) throw new Error("Invalid order ID or status.");

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_("Orders");
    const row = findRowByValue_(sh, "order_id", orderId);
    if (!row) throw new Error("Order not found.");

    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(function(h) { return String(h).trim(); });
    const statusCol = headers.indexOf("status") + 1;
    const updatedCol = headers.indexOf("updated_at") + 1;
    if (!statusCol) throw new Error('Missing "status" column in Orders sheet.');
    sh.getRange(row, statusCol).setValue(status);
    if (updatedCol) sh.getRange(row, updatedCol).setValue(new Date());

    logAdminAction_(admin.email, "order_status_updated", "order", orderId, {status:status}, "success");
    return {success:true, order_id:orderId, status:status};
  } finally {
    lock.releaseLock();
  }
}

function logAdminAction_(email, action, entityType, entityId, details, result) {
  appendObject_("AdminLogs", {
    log_id: Utilities.getUuid(),
    timestamp: new Date(),
    admin_identifier: clean_(email, 160),
    action: clean_(action, 80),
    entity_type: clean_(entityType, 80),
    entity_id: clean_(entityId, 120),
    details_json: JSON.stringify(details || {}),
    result: clean_(result, 40)
  });
}

/** Run manually to confirm the required server-side configuration exists. */
function checkTryznAdminConfiguration() {
  const props = PropertiesService.getScriptProperties();
  const email = props.getProperty("ADMIN_EMAIL");
  const password = props.getProperty("ADMIN_PASSWORD");
  Logger.log("ADMIN_EMAIL configured: " + Boolean(email));
  Logger.log("ADMIN_PASSWORD configured: " + Boolean(password));
  if (!email || !password) {
    throw new Error("Add ADMIN_EMAIL and ADMIN_PASSWORD in Project Settings > Script properties.");
  }
}
