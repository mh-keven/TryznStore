# Tryzn Store — Google Admin Sign-In Setup

This setup keeps the existing GitHub Pages storefront and Google Sheets database. The OAuth client ID is public configuration; no OAuth client secret belongs in the website.

## Repository changes in this stage

- Adds Google Identity Services sign-in to the existing sign-in modal.
- Sends the Google ID token to Apps Script for server-side checks.
- Checks token audience, issuer, expiry, verified email, and a server-side email allowlist.
- Adds protected Apps Script actions to fetch orders and update order status.
- Re-checks authorization for every protected order request.
- Stores the ID token in JavaScript memory only; it is not written to localStorage.
- Logs admin sign-in and order status changes to AdminLogs.
- Preserves existing category and storefront rendering code.

## 1. Create a Google OAuth web client

1. Open Google Cloud Console: https://console.cloud.google.com/
2. Select or create a project.
3. Configure the OAuth consent screen and add your account as a test user if the app is in testing mode.
4. Create an OAuth 2.0 Client ID of type **Web application**.
5. Add this Authorized JavaScript origin for GitHub Pages:
   `https://mh-keven.github.io`
6. If the store uses a custom domain later, add that domain's origin too.
7. Copy the **Client ID** (not a client secret).

## 2. Configure the public client ID

In `index.html`, replace the empty string below with the Web client ID:

```js
window.TRYZN_GOOGLE_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
```

The Client ID is intended to be public. Do not add a client secret here.

## 3. Configure Apps Script Script Properties

Open the Apps Script project attached to the Tryzn Store spreadsheet. In **Project Settings → Script properties**, add:

- `GOOGLE_CLIENT_ID` = the exact same Web client ID used in `index.html`
- `ADMIN_EMAILS` = comma-separated list of permitted administrator Google account emails, for example `admin@example.com`

Use the actual account you control. Keep the allowlist in Script Properties, not in website JavaScript.

Run `checkTryznAdminConfiguration()` in the editor to confirm both properties exist. This check does not verify that the OAuth client or deployment is correct.

## 4. Deploy the Apps Script

1. Ensure the script is bound to the correct Tryzn Store spreadsheet.
2. Run `setupTryznDatabase()` once and approve the required spreadsheet permissions.
3. Choose **Deploy → Manage deployments → Edit** (or create a Web app deployment).
4. Deploy as the spreadsheet owner/account that should own the data operations.
5. Set access so the public storefront can read products and submit checkout requests. Because this is a public storefront, the web app endpoint must be reachable by visitors.
6. Deploy a **new version** after code changes and confirm the URL ending in `/exec` still matches `CFG.api` in `script.js`.

Do not share the spreadsheet itself publicly. Public web app access is not the same as public spreadsheet access.

## 5. Test the admin flow

- Open the published storefront and hard-refresh it.
- Open Account Login and use the Google button under Store administrator.
- Sign in with an account included in `ADMIN_EMAILS`; another Google account must be denied.
- Check AdminLogs for the result.
- Change an order status and confirm it changes in the Orders sheet.
- Sign out, then try to call a protected action without a credential; the server must reject it.
- Confirm no ID token or password is stored in localStorage.

## Important limitations before real production use

- The current Apps Script implementation uses Google's `tokeninfo` endpoint to validate ID tokens. Google documents this endpoint for development/debugging and recommends a proper server-side JWT verification library for production. Treat this as a staged integration, not a final production security certification.
- The admin dashboard's product, category, promotion, and media editors still have local-browser behavior in this stage. They are not yet fully persisted to Sheets through protected admin endpoints. Do not rely on those editors for production inventory management until their server-side operations are implemented.
- Public checkout currently accepts totals and item prices sent by the browser. Before accepting real orders, calculate totals from trusted product records on the server, validate stock and promo rules, and add abuse protection.
- Customer registration in the current storefront uses browser-local customer records. It is not secure account authentication and must not be used to protect private customer/order data.
- Admin token is memory-only, but page reload requires signing in again. This is intentional for the current stage.
