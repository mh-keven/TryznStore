# Tryzn Store — Google Sheets Setup

## 1. Configure the admin login

In the Apps Script project attached to the Tryzn Store spreadsheet, open **Project Settings → Script properties** and add:

- `ADMIN_EMAIL` — your admin email address
- `ADMIN_PASSWORD` — your admin password

Keep the password in Script properties, not in `index.html` or `script.js`. The website sends the entered credentials to Apps Script over HTTPS, and Apps Script checks them before returning orders or changing order status.

## 2. Deploy and test

1. Run `setupTryznDatabase()` once to create/check the required sheet tabs.
2. Run `checkTryznAdminConfiguration()` and confirm both properties are configured.
3. Deploy the Apps Script project as a Web App, executing as the spreadsheet owner. Update the existing deployment to a new version.
4. Confirm `CFG.api` in `script.js` points to the deployed `/exec` URL.
5. Open the website, enter the configured admin email/password in the Store administrator section, and confirm the dashboard loads orders from the `Orders` sheet.
6. Change an order status and verify it updates in Google Sheets.

The current dashboard connects order viewing and order-status changes to Sheets. Product, category, promo, and media editors still need server-side persistence to sync across devices. For a public production store, add rate limiting and stronger session management before handling sensitive data.
