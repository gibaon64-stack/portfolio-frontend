# Frontend

Vite + React frontend for Mabrixel Technologies. Desktop navigation retains
Home, Projects, Services, About Us, and Profile; mobile public pages use a
fixed bottom bar for Home, Projects, Journey, Social, and Inquiries. Journey
and Social are available at `/journey` and `/social`. Administrator sign-in
and the protected CMS are at `/admin`.

Set `VITE_API_BASE_URL` to `/api` locally or the deployed Flask API's `/api` URL
for production builds. Locally, Vite proxies `/api` to Flask using
`VITE_API_PROXY_TARGET`.

The projects page reads published project records from the API, uses each
project's own validated live URL, supports administrator ordering, and shows
its aspect-ratio-preserving thumbnail, technologies, and development story.
The profile and Journey pages read editable profile data and multiple uploaded
photographs per milestone. The services page separates website requirements, custom application
quotes, and the Bronze/Silver/Gold digital marketing packages. Package prices
are fixed while confirmed inclusions and quantities can be managed from the
admin dashboard.

## Deploy on Netlify

Connect this repository to Netlify. The root `netlify.toml` configures the build
and sets `VITE_API_BASE_URL=/api`; `public/_redirects` proxies API requests to
the Render backend and rewrites client-side routes to `index.html`.

Set the backend's `FRONTEND_ORIGIN` to this site's exact public origin.

## Deploy on Render

Alternatively, create a Blueprint from this repository and select `render.yaml`.
Set `VITE_API_BASE_URL` to the backend's public URL with `/api` appended.
The free configuration is suitable for a demo only; see the backend README for
the free database and upload-storage limitations.

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
```
