# LUMEN — Persian Photography E-Commerce

## Overview
Premium dark-themed Persian (Farsi) RTL e-commerce website for photography/filmmaking gear.
- **Frontend**: React 18 + TypeScript + Vite 6 + Tailwind CSS 3 + Lucide React + react-router-dom
- **Backend**: Node.js + Express + PostgreSQL 16 + JWT auth + bcrypt + multer (image uploads)
- **Font**: Vazirmatn (via @fontsource-variable/vazirmatn)
- **Language**: Persian (Farsi) throughout, RTL layout, Persian numerals, Toman pricing

## Architecture
- Frontend (Vite dev server) on port 5173, mapped to host port 3000
- Backend (Express) on port 8000, accessed via Vite proxy (`/api` → `http://backend:8000`)
- PostgreSQL on default port 5432 (internal only)
- Single-origin wiring: all API calls go through Vite proxy (no CORS issues, same-origin cookies)

## Docker Compose
`docker-compose.base44.yml` defines three services:
- `db`: postgres:16-alpine with healthcheck
- `backend`: node:22-slim, installs deps on startup, runs `node server.js`
- `frontend`: node:22-slim, installs deps on startup, runs `vite dev`

## Default Admin Credentials
- Email: `admin@lumen.ir`
- Password: `LumenAdmin@2026`
- Role: OWNER
- **Change these immediately after first login via Settings → Change Password**

## Key Routes
- `/` — Homepage with all sections (hero, categories, featured, best sellers, kits, editorial, promo, testimonials, newsletter)
- `/product/:id` — Product detail page
- `/category/:slug` — Category listing
- `/admin/login` — Admin login
- `/admin` — Admin dashboard (protected)
- `/admin/products` — Product CRUD (protected)
- `/admin/products/new` and `/admin/products/:id` — Product editor (protected)
- `/admin/categories` — Category management (protected)
- `/admin/settings` — Password change, admin management, ownership transfer (protected)

## Roles
- **OWNER**: Full access including ownership transfer and admin management
- **AUTHORIZED_ADMIN**: Can manage products, categories, kits, editorial, testimonials
- **CUSTOMER**: No admin access

## Environment Variables
- `DATABASE_URL` — Set in compose (local PostgreSQL)
- `JWT_SECRET` — Generated development secret in `/run/base44/app.env`, fallback in `.env.base44-defaults`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — Initial owner credentials (compose environment)
- `UPLOAD_DIR` — Path for uploaded images (Docker volume `uploads`)
- `BASE44_PREVIEW_MODE` — Sandbox flag, passed to services

## Verification
- `curl http://localhost:3000/api/health` → `{"ok":true}`
- `curl http://localhost:3000/api/products` → Product list
- Admin login: POST `/api/auth/login` with default credentials
- Frontend: `curl http://localhost:3000/` → HTML with `<html lang="fa" dir="rtl">`

## File Structure
```
backend/     — Express API server
  server.js  — All API routes
  db.js      — PostgreSQL connection, schema, seed data
  middleware/auth.js — JWT verification, role checks
frontend/    — Vite React app
  src/components/ — UI components (Header, Hero, ProductCard, etc.)
  src/pages/      — Page components (Home, ProductDetail, Admin*, etc.)
  src/context/    — Cart and Auth contexts
  src/lib/        — API client, types, formatting utils
```
