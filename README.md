# Frontend

Vite + React frontend for Mabrixel Technologies. The public site is at `/`,
administrator sign-in is at `/account`, and the protected CMS is at `/admin`.

Set `VITE_API_BASE_URL` to `/api` locally or the deployed Flask API's `/api` URL
for production builds. Locally, Vite proxies `/api` to Flask using
`VITE_API_PROXY_TARGET`.

## Deploy on Render

Create a Blueprint from this repository and select `render.yaml`. When prompted
for `VITE_API_BASE_URL`, enter the backend's public URL with `/api` appended,
for example `https://mabrixel-portfolio-api.onrender.com/api`.

The backend's `FRONTEND_ORIGIN` must be set to this static site's exact public
origin, for example `https://mabrixel-portfolio-frontend.onrender.com`.

The free configuration is suitable for a demo only; see the backend README for
the free database and upload-storage limitations.

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
```
