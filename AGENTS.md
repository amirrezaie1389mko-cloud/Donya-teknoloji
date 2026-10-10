# Base44 Setup Notes

## Project Overview
This is a single-file static HTML e-commerce storefront (Persian/Farsi, RTL) called "دنیای تکنولوژی" (World of Technology). The entire app — HTML, CSS, and JavaScript — lives in one file: `donyaye_technology_final-3 (2).html`.

## How It Runs
- Served by **nginx:alpine** via `docker-compose.base44.yml` on host port 3000.
- nginx config (`nginx.base44.conf`) sets the HTML file as the index document.
- No backend, no database, no build step, no external dependencies.
- No secrets or credentials required.

## Verification
- `curl http://localhost:3000/` should return the HTML page.
- The preview shows the storefront with product listings, cart, checkout, and order tracking — all client-side.

## Editing
- Changes to the HTML file are visible on browser refresh (nginx serves the file directly from the bind mount).
- No live-reload server; call `reload_preview` after edits if needed.
