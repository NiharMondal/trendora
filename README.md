# Trendora — frontend

The storefront, seller portal and admin console for **Trendora**, a multi-vendor fashion
marketplace. Many stores list products; a shopper checks out once across several of them, each
store ships its own parcel, and the platform takes a commission.

Built with Next.js 15 (App Router, Turbopack), React 19, Redux Toolkit / RTK Query, NextAuth,
Tailwind CSS v4 and shadcn/ui.

This repo is only the frontend. It talks to the **backend API**
([`trendora-backend`](https://github.com/NiharMondal/trendora-backend), Express 5 + Prisma) over
HTTP and holds no business logic of its own beyond authentication.

## Getting started

You need Node.js 18.18 or newer (Next 15's minimum), [pnpm](https://pnpm.io), and a running backend.

```bash
# 1. Start the backend first (in the backend repo) — it serves http://localhost:5001/api/v1.
#    A fresh database needs: pnpm prisma:migrate && pnpm seed

# 2. Configure this repo
pnpm install
cp .env.example .env.local      # then fill in the values — see below

# 3. Run it
pnpm dev                        # http://localhost:3000
```

Use port **3000**: the backend's CORS only allows `http://localhost:3000`.

The backend seed creates four logins to try every role: `admin@`, `customer@`, `vendor1@` and
`vendor2@trendora.test`. They share the backend's `SEED_PASSWORD`, which falls back to
`Password123!` if unset.

## Environment

Every variable in [`.env.example`](.env.example) is **required**, and the file explains each one.
They are validated at build time and at page load (`src/shared/config/env-config.ts` for public
values, `server-env.ts` for secrets). A missing or malformed value fails with a message naming
it, instead of silently misbehaving.

Two values must match the backend:

- `NEXT_PUBLIC_TAX_RATE` must equal the backend's `TAX_RATE`. The cart's quote is computed here,
  but the backend recomputes the real charge.
- `NEXT_PUBLIC_BACKEND_URL` must include `/api/v1`.

## Scripts

| Command | Does |
| --- | --- |
| `pnpm dev` | Development server with Turbopack |
| `pnpm build` | Production build. Always use the script: a bare `next build` uses webpack and fails on `@react-pdf/renderer`. |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint. The baseline is 11 warnings and 0 errors; don't add to it. |

There is no test runner yet. Verify a change with `pnpm lint`, `pnpm build`, and by exercising the
affected flow against a running backend.

## Where to look

- **[`CLAUDE.md`](CLAUDE.md)** is the architecture guide: route groups, the feature-folder layout,
  the auth flow, the marketplace model (per-store shipping, per-parcel orders, refunds), the data
  layer and the UI conventions. Read it before changing cart, checkout, order or product code.
- **[`docs/FEATURE-GAPS.md`](docs/FEATURE-GAPS.md)** is the prioritised audit of what is missing
  or drifted from the backend, with each item anchored to a file and line.

At a glance:

```
src/
├── app/        routing only — thin page.tsx / layout.tsx shells
├── features/   one folder per domain (products, cart, orders, vendors, …) — most code lives here
├── shared/     cross-feature UI, form fields, hooks, config and types
├── layouts/    navbar, dashboard sidebar, footer
└── store/      Redux store and the single RTK Query API
```
