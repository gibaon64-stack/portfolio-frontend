# Frontend

Vite + React frontend for Mabrixel Technologies. The public site is at `/`,
administrator sign-in is at `/account`, and the protected CMS is at `/admin`.

Set `VITE_API_BASE_URL` to `/api` locally or the deployed Flask API's `/api` URL
for production builds. Locally, Vite proxies `/api` to Flask using
`VITE_API_PROXY_TARGET`.

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
```
