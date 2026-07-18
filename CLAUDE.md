# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**. Next.js 15 with Turbopack.

```bash
pnpm dev      # dev server (Turbopack) at http://localhost:3000
pnpm build    # production build (Turbopack)
pnpm start    # serve production build
pnpm lint     # eslint (next/core-web-vitals + next/typescript; no-explicit-any is a warning)
```

There is no test runner configured in this project.

## Architecture

Trendora is the **frontend** for an e-commerce app. It talks to a separate backend API (`NEXT_PUBLIC_BACKEND_URL`); this repo contains no server-side business logic beyond NextAuth and thin API routes. It is a Next.js **App Router** project (`src/app`) with the `@/*` path alias mapped to `src/*`.

### Route groups (`src/app`)
- `(root)` — public storefront (products, categories, cart, checkout, wish-list, about-us).
- `(auth)` — login, register, forgot-password.
- `(dashboard)` — authenticated area split into `admin` (ADMIN/SUPER_ADMIN) and `dashboard` (CUSTOMER). The `(dashboard)/layout.tsx` reads the session server-side via `getServerSession(authOptions)` and renders role-appropriate sidebar.
- `api/auth/[...nextauth]` — NextAuth handler.

### Auth (NextAuth + backend JWT)
Auth is JWT-strategy NextAuth defined in `src/lib/authOptions.ts`, wrapping a backend that issues its own `accessToken`/`refreshToken`.
- Providers: `Credentials` (posts to `/auth/login`) and `Google` (posts to `/auth/oauth-login`).
- The NextAuth `jwt` callback stores the backend tokens and refreshes via `/auth/refresh-token` when the access token is near expiry (`REFRESH_SKEW_MS`). On failure it sets `token.error = "RefreshAccessTokenError"`.
- Roles come from `src/global/user-role.ts` (`EnumUserRole`: SUPER_ADMIN / ADMIN / CUSTOMER).
- `src/middleware.ts` gates `/admin/*` and `/dashboard/*`; non-admins hitting `/admin` are redirected to `/dashboard`.
- `src/components/providers/auth-sync.tsx` redirects already-authenticated users away from public auth pages to their role home.
- Session/token typing is augmented in `src/types/next-auth.d.ts`; use `useUserInfoClient()` / `useUserInfoServer()` (`src/utils/user-info.ts`) to read the current user.

### Data layer (RTK Query)
All server data flows through **RTK Query**, not manual fetch.
- `src/redux/api/baseApi.ts` is the single `createApi` root. It declares all `tagTypes` and a `baseQueryWithReauth` that injects the NextAuth `accessToken` as the `authorization` header and, on a 401, re-runs `getSession()` (triggering token refresh) before retrying — or calls `signOut()` if refresh failed.
- Feature APIs (`productApi.ts`, `orderApi.ts`, etc.) use `baseApi.injectEndpoints({...})` and export the generated hooks. **Add new endpoints by injecting into `baseApi`; do not create a second `createApi`.** New tag types must be registered in `baseApi.ts`.
- Cache invalidation uses `providesTags` / `invalidatesTags` against the shared tag list.
- List/query endpoints build their query string with `buildQueryParams` (`src/utils/build-query-params.ts`), which drops values equal to defaults (`page:1`, `limit:10`, `sortBy:createdAt:desc`). The `useTableFilters` hook (`src/hooks`) keeps table pagination/search/sort state in the URL and debounces search.

### Redux store
`src/redux/store.ts` combines `baseApi.reducer` with a `cart` slice that is **persisted to localStorage** via `redux-persist` (only the cart is persisted). Cart logic and selectors live in `src/redux/slice/cartSlice.ts` — cart items are keyed by `productId` + `variantId`. Use the typed hooks in `src/redux/redux.hooks.ts`.

### Providers
`src/app/layout.tsx` wraps everything in `Providers` (`src/components/providers/providers.tsx`): Redux `Provider` → NextAuth `SessionProvider` → `AuthSync` → redux-persist `PersistGate`. A global `sonner` `<Toaster />` is mounted here for toasts.

### API responses & types
Backend responses follow the `TServerResponse<T>` envelope (`src/components/types/common.types.ts`): `{ success, message, meta?, result }`, where `meta` carries pagination. Per-domain types live in `src/components/types/*.types.ts`.

### UI conventions
- **shadcn/ui** (new-york style, `src/components/ui`) + Tailwind CSS v4 (config-less; theme in `src/app/globals.css`). `cn()` from `src/lib/utils.ts` merges classes.
- Radix primitives, `lucide-react` icons, `motion` for animation, `recharts` for dashboard charts, `embla-carousel` for carousels, `vaul` for drawers.
- Forms use **react-hook-form + zod** via `@hookform/resolvers`; co-locate the zod schema with the form (e.g. `components/common/form/product-form/product-form-schema.ts`).
- Image uploads go to **Cloudinary** through `src/utils/uploadToCloudinary.ts` (unsigned preset, `trendora/<folder>`); `next.config.ts` allows any https image host.

## Environment
Required env vars (`.env.local`):
- `NEXT_PUBLIC_BACKEND_URL` — backend API base URL (all RTK Query + auth calls target this).
- `NEXT_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — NextAuth.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_PRESET_NAME` — image uploads.
- `NEXT_PUBLIC_TAX_RATE`, `NEXT_PUBLIC_SHIPPING_COST`, `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` — checkout math (see `src/utils/calculate-order-total.ts`).

Public config is read through `src/config/env-config.ts`.
