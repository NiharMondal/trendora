# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**. Next.js 15 (App Router) with Turbopack, React 19.

```bash
pnpm dev      # dev server (Turbopack) at http://localhost:3000
pnpm build    # production build (Turbopack)
pnpm start    # serve production build
pnpm lint     # eslint (see caveat below)
```

There is no test runner configured in this project.

`pnpm lint` passes (exit 0) with **52 warnings, 0 errors** — mostly `@typescript-eslint/no-explicit-any`,
plus `@next/next/no-img-element` and a few `no-unused-vars`. `any` is used freely across the older
code (`error: any` in catch blocks, `(row as any)[col.key]` in the table renderer), so treat the
warning count as a baseline: don't add to it, and don't expect a clean run. Newer marketplace code
uses `(error as { data?: { message?: string } })?.data?.message` instead of `error: any` — prefer
that in new code.

**`pnpm build` must be run as the script (`next build --turbopack`).** A bare `next build` uses
webpack and fails on `@react-pdf/renderer`'s ESM-only package in
`features/orders/components/my-orders/pdf-download-print.tsx`.

`eslint.config.mjs` needs both of its non-`extends` entries to stay shaped as flat-config **objects** —
a bare `"rule-name", "warn"` pair in the array makes ESLint 9 abort with
`TypeError: Unexpected non-object config`, and without the leading `ignores` entry ESLint lints the
whole `.next/` build output (tens of thousands of issues in generated chunks).

## Architecture

Trendora is the **frontend** for a **multi-vendor marketplace**. It talks to a separate backend API
(`NEXT_PUBLIC_BACKEND_URL`); this repo contains no server-side business logic beyond NextAuth and
the NextAuth route handler. `@/*` is aliased to `src/*`.

Many sellers list products, buyers check out once across several stores, and the platform takes a
commission. Read **The marketplace model** below before touching cart, checkout, order or product
code — those flows changed shape, and `backend/CLAUDE.md` has the server-side half.

### Route groups (`src/app`)
- `(root)` — public storefront (products, categories, cart, checkout, wish-list, about-us, plus
  `stores` / `stores/[slug]` — the seller directory and storefronts).
- `(auth)` — login, register, forgot-password.
- `(dashboard)` — authenticated area split three ways: `admin` (ADMIN), `vendor` (VENDOR, the
  seller portal) and `dashboard` (CUSTOMER). `(dashboard)/layout.tsx` reads the session server-side
  via `getServerSession(authOptions)` and renders the role-appropriate sidebar (the three link sets
  are in `layouts/dashboard/dashboard-navlink.ts`).
- `api/auth/[...nextauth]` — NextAuth handler.

**The dashboard sidebar is flat — a resource gets exactly one row.** `dashboard-navlink.ts` still
groups a resource's screens under `children`, but those children are no longer sub-rows: they are
the **tabs** rendered above the page by `layouts/dashboard/dashboard-tabs.tsx`, which the
`(dashboard)/layout.tsx` mounts once for every dashboard route. So "Brand List" and "Add Brand"
remain two real routes that read as two tabs of one screen, and a new screen gets its tab for free
by being added to `children` — never add a page-level tab strip by hand. The row links to the child
marked `index: true`. A group with fewer than two children renders no tab strip, so flatten it to a
plain `{ title, url, icon }` entry instead. `shared/components/page-tabs.tsx` (`PageTabs`) is the
presentational strip if a non-dashboard page ever needs one; active-route matching for both the
sidebar and the tabs goes through `shared/utils/match-path.ts` so nested routes
(`/admin/product-list/update-product/<id>`) keep their parent lit.

Admin routes use parenthesised **non-URL grouping folders** to bundle a resource's pages, e.g.
`admin/(brand)/add-brand` + `admin/(brand)/brand-list` both live at `/admin/...`. **`src/app`
holds nothing but `page.tsx` / `layout.tsx` / `route.ts`** — every page is a thin shell that renders
a component from `src/features/<feature>/components/`.

### Folder structure (feature-based)

```
src/
├── app/          routing only — page.tsx / layout.tsx / route.ts
├── features/     one folder per domain; where nearly all code lives
├── shared/       cross-feature primitives (ui, form, components, hooks, lib, utils, constants, types, config)
├── layouts/      navbar/, dashboard/ (sidebar + navlinks), footer.tsx
├── store/        store.ts, redux.hooks.ts, api/base-api.ts
├── providers/    providers.tsx
├── assets/  types/ (ambient only)  middleware.ts
```

The 17 features: `addresses`, `analytics` (admin dashboard widgets), `auth`, `brands`, `cart`,
`categories`, `checkout`, `home` (storefront landing sections), `orders`, `payouts`, `products`,
`reviews`, `size-groups`, `sizes`, `users`, `vendors`, `wishlist`. Each uses the same subfolders,
all optional:

```
features/<feature>/
├── api/          <name>.api.ts — baseApi.injectEndpoints
├── components/
├── schemas/      zod + inferred T<Resource>FormValues
├── types/        <name>.types.ts
├── hooks/  utils/  constants/  store/   (store/ = a redux slice, only features/cart has one)
```

Dependency rules:
- `app/` imports from `features/`, `layouts/`, `shared/` — never the reverse.
- `shared/` **never** imports from `features/` — keep it that way. `layouts/`, `store/` and
  `providers/` do reach into a few features by necessity (navbar → `cart` selectors, dashboard
  sidebar/nav-user → `auth` role+session types and `useMyProfileQuery`, `store.ts` → the cart slice,
  `providers.tsx` → `AuthSync`); add to that list only when a layout genuinely needs feature state.
- Cross-feature imports are allowed but should stay few; they are listed by
  `grep -rn '@/features/' src/features` and today form a DAG except `products` ↔ `wishlist`
  (product cards use `useWishlistToggle`, wishlist cards use `ProductPrice`).
- Features deliberately have **no barrel `index.ts`** (unlike `shared/components/table`, which keeps
  its own): one barrel per feature would turn that
  products/wishlist pair into a real circular module dependency and would pull every component of a
  feature into any route that touches it. Import the exact file.

Two things stay central by necessity: `store/api/base-api.ts` (there is exactly one `createApi`, and
its `tagTypes` array is global) and `store/store.ts` (the root reducer registers `features/cart`'s
slice).

Adding a resource means one new folder — `features/<x>/{api,components,schemas,types}` — plus its
tag names in `base-api.ts` and a thin `page.tsx`.

### Auth (NextAuth + backend JWT)
JWT-strategy NextAuth defined in `src/features/auth/lib/auth-options.ts`, wrapping a backend that issues its own
`accessToken`/`refreshToken`.
- Providers: `Credentials` (posts to `/auth/login`) and `Google` (posts to `/auth/oauth-login`).
- The `jwt` callback stores the backend tokens and refreshes via `/auth/refresh-token` when the
  access token nears expiry (`REFRESH_SKEW_MS`). On failure it sets `token.error = "RefreshAccessTokenError"`.
- Roles: `EnumUserRole` in `src/features/auth/constants/user-role.ts`
  (SUPER_ADMIN / ADMIN / **VENDOR** / CUSTOMER). `SUPER_ADMIN` does not exist on the backend — no
  JWT will carry it — but existing checks reference it, so it is kept and treated as an admin.
- **Where a role belongs is centralised in `src/features/auth/utils/role-home.ts`**
  (`roleHomePath`, `isAdminRole`, `isVendorRole`, `isShopperRole`). That ternary used to be
  copy-pasted into the middleware, `AuthSync`, the login form and the login page; adding a fourth
  role to four copies is how one gets missed. Use the helpers.
- `src/middleware.ts` gates `/admin/*`, `/vendor/*` and `/dashboard/*`
  (`authorized: !!token && !token.error`); anyone reaching an area their role does not own is sent
  to `roleHomePath(role)`. **`/vendor/apply` is the deliberate exception** — a CUSTOMER must be able
  to reach it, since that is how they become a seller.
- `src/features/auth/components/auth-sync.tsx` redirects already-authenticated users away from public
  auth pages to their role home.
- Session/token typing is augmented in `src/types/next-auth.d.ts`; read the current user with
  `useUserInfoClient()` / `useUserInfoServer()` (`src/features/auth/utils/user-info.ts`).

### The marketplace model

**A VENDOR is still a shopper.** They have their own cart, addresses, orders and wishlist, so every
buyer-facing route guards with all three roles. Writing `authGuard(Role.CUSTOMER)`-style checks —
or `role === "CUSTOMER"` — locks sellers out of their own checkout. Use `isShopperRole`.

**Cart lines carry their store, and shipping is charged PER STORE.** This is the part most likely
to be broken by accident:

- `TCartItem` snapshots `vendorId` / `storeName` / `vendorShippingFee` /
  `vendorFreeShippingThreshold` when the item is added. Product payloads carry those on
  `product.vendor` for exactly this reason.
- **Build cart lines only through `toCartItem()`** (`features/cart/utils/to-cart-item.ts`). Three
  call sites used to assemble the object by hand; any one of them omitting the store snapshot
  silently produces a wrong total.
- `calculateOrderTotals()` groups by store, evaluates each store's own free-shipping threshold and
  sums. A two-store cart pays **two** shipping fees. `NEXT_PUBLIC_SHIPPING_COST` /
  `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` are now only fallbacks for a cart persisted before stores
  existed — real values come from the item. `NEXT_PUBLIC_TAX_RATE` is still platform-wide and must
  match the backend's `TAX_RATE`.

**Orders nest per-store parcels.** `TOrder.orderStatus` is a *rollup*; the authoritative fulfilment
state, tracking number and carrier live on each `TVendorOrder` in `order.vendorOrders`. Render
per-store detail from those, and note there is no whole-order status endpoint — fulfilment is
`useUpdateVendorOrderStatusMutation` against one parcel
(`features/vendors/api/vendor-order.api.ts`). `VENDOR_TRANSITIONS` in
`vendor-order-status-modal.tsx` mirrors the backend state machine so the UI cannot offer a move
that will be rejected (a vendor cannot cancel a shipped parcel — that is admin-only).

**Products have two independent gates.** `status` is admin moderation
(`DRAFT → PENDING → APPROVED/REJECTED`) and `isPublished` is the seller's own switch; a listing is
on the storefront only when it is APPROVED *and* published *and* its store is approved. Two
consequences for reads:

- `/products` and `/products/:id` apply that filter, so they **404 on a draft**. Admin and vendor
  screens must use `useMyVendorProductByIdQuery` / `useMyVendorProductsQuery` /
  `useAllProductsForAdminQuery` instead.
- An ADMIN creating a product must send `vendorId` (see `create-product.tsx`, which passes
  `vendorOptions` to `ProductForm`); a VENDOR sends nothing and gets their own store.

**Editing a product must preserve variant/image `id`s.** The backend keeps the variants and images
whose ids it receives and deletes the rest — images are destroyed in Cloudinary too. That is why
`mapProductToFormValues` and the zod schemas carry `id`; dropping it turns every edit into a
delete-and-recreate that breaks live image URLs.

**Money vocabulary.** `vendorEarning` is what a store is owed (commission and tax already removed);
`totalRevenue` in the admin analytics is gross merchandise value, most of which belongs to sellers,
and `platformCommission` is what Trendora actually earns. Don't label GMV as revenue.

**Refunds are automatic, and their status is about the MONEY, not the parcel.** Cancelling a paid
parcel issues a real Stripe refund, so `features/refunds` has no "create refund" call for the happy
path. Two consequences for the UI:

- A parcel can be `CANCELED` while its `refund.status` is still `FAILED` — that is a buyer who has
  not been paid back. Never present "cancelled" as if the money is settled; render
  `slice.refund.status` with `refundStatusMap` beside it (see `my-orders-list.tsx`).
- `payment.refundAmount` is money that **actually went back**, not what is owed. `PaymentStatus`
  gained `PARTIALLY_REFUNDED` for the one-parcel-of-three case.

`/admin/refunds` is a failure queue: its normal state is empty, and anything in it is money owed. Only
a `gateway === "stripe"` refund can be retried — a manual one never had a gateway to call.

### Data layer (RTK Query)
All server data flows through **RTK Query**, never manual fetch (the two exceptions are Cloudinary
upload and `deleteTempImage`).
- `src/store/api/base-api.ts` is the single `createApi` root (marketplace tags: `vendors`,
  `vendorOrders`, `payouts`, `vendorReviews`). It declares every `tagType` and a
  `baseQueryWithReauth` that injects the NextAuth `accessToken` as the `authorization` header and,
  on a 401, re-runs `getSession()` (which re-triggers the NextAuth `jwt` callback and thus the token
  refresh) before retrying — or calls `signOut()` if refresh failed.
- Feature APIs (`features/products/api/product.api.ts`, `features/orders/api/order.api.ts`, …) use `baseApi.injectEndpoints({...})` and export
  the generated hooks. **Add endpoints by injecting into `baseApi`; never create a second
  `createApi`.** New tag types must be registered in `baseApi.ts`. The file name does not always
  match the feature: `features/home`'s endpoints live in `api/slide.api.ts` (hero slides, tag
  `slides`).
- Cache invalidation is coarse: `providesTags` / `invalidatesTags` against whole tag names
  (`["brands"]`), not per-id tags.
- List endpoints take `Record<string, string>` and build their query string with `buildQueryParams`
  (`src/shared/utils/build-query-params.ts`), which **drops values equal to the defaults**
  (`page:1`, `limit:10`, `search:""`, `sortBy:createdAt:desc`) to keep URLs and cache keys clean.

### The storefront catalogue is faceted, and the facets come from the server

`/products` (`features/products/components/product-wrapper.tsx`) is the reference for a public,
filterable list. It is **not** a `DataTable` — it is a grid with a sidebar — but it shares the URL
state machinery:

- **`useProductFilters`** (`features/products/hooks/use-product-filters.ts`) wraps `useTableFilters`
  with the storefront's filter set and adds the one thing a facet panel needs that a table toolbar
  does not: **multi-select**, stored as one comma-joined param per dimension
  (`?brandId=nike,adidas`), which is the form the backend reads as an `IN`.
- **`PRODUCT_FILTER_KEYS` mirrors `STOREFRONT_FILTER_KEYS`** in the backend's
  `helpers/product-filter.ts`. The two must agree: the backend turns an unrecognised key into a
  `where` clause on a column of that name, so a typo here fails as an empty page, not an error.
- **The options are not declared in this repo.** `GET /products/filters`
  (`useProductFiltersQuery`) returns the categories, brands, sizes, genders, stores, price range and
  rating buckets that exist in the live catalogue, each with a count. Sellers list whatever they
  like, so which of those exist is a property of the data — a vendor opening a new category appears
  in the panel with no frontend change. Don't reintroduce a hardcoded list; three such components
  were deleted for exactly this reason.
- **Both queries take the SAME `queryParams`.** That is what keeps the counts honest — they are
  computed from the current selection, not the whole catalogue. The counts are disjunctive
  server-side, so ticking one brand leaves the others tickable.
- **`ProductFilterPanel` is rendered twice** — as the `lg` sidebar and inside the mobile `TDSheet` —
  from one component, so the two cannot drift. `showHeading={false}` in the sheet, whose own header
  already says "Filters".

**Use `setFilters` (plural), not two `setFilter` calls,** when moving more than one param at once.
Both build their `URLSearchParams` from the same render's snapshot, so the second silently discards
the first — a price min/max pair loses its min. `PriceFilter` applies on submit rather than per
keystroke for the same class of reason: a number input fires on every digit.

`app/(root)/products/page.tsx` wraps the wrapper in `<Suspense>` — Next 15 requires it for
`useSearchParams`, and without it the route opts out of static rendering at build time.

**Both navbar search boxes feed this page** through `layouts/navbar/use-navbar-search.ts`, which
pushes `/products?search=<q>` and **mirrors that param back into the input**. The URL is the single
source of truth for both boxes; the hook keeps a local draft only for what has been typed and not
yet submitted. Skipping that sync is a visible bug — search from the navbar, clear the catalogue
toolbar, and the navbar goes on advertising a search that is no longer running.

The sync is a **reset-on-change during render**, not a `useEffect`:

```ts
const [query, setQuery] = useState(urlTerm);
const [syncedTerm, setSyncedTerm] = useState(urlTerm);
if (urlTerm !== syncedTerm) { setSyncedTerm(urlTerm); setQuery(urlTerm); }
```

An effect would repaint the stale term for a frame, and a plain `setQuery(urlTerm)` on every render
would clobber the shopper mid-word. `urlTerm` only moves on navigation, so a draft survives typing.

`useSearchParams` in the navbar is safe **here specifically**: `Navbar` is mounted in
`app/(root)/layout.tsx`, not the global root layout, and `Providers` gates the whole tree behind
`PersistGate loading={null}` — so no page has meaningful prerendered HTML to lose in the first
place. `pnpm build` confirms it: `/about-us`, `/cart`, `/checkout` and `/products` all stay
`○ Static`. Re-check that route table if the navbar moves up a layout or `PersistGate` goes away.

Off `/products` the box shows nothing, because no search is running there. A navbar search also
pushes the bare path, so it starts a fresh result set rather than merging into filters left behind.

### Tables (centralized `DataTable`)
Admin/customer lists are all built from one generic table in `src/shared/components/table`
(import from its `index.ts` barrel). Three pieces work together:

1. **`useTableFilters`** (`src/shared/hooks/use-table-filters.ts`) — single source of truth for
   pagination/search/sort. State lives in the **URL search params** (`router.replace`, params equal
   to defaults are deleted), search is debounced 1000ms, and it returns both UI state
   (`search`, `sortBy`, `limit`, `currentPage` + setters) and `queryParams` to feed the RTK Query hook.
2. **`DataTable<T, S>`** — renders `TableToolbar` (when `filters`, `title`, `description` or
   `actions` is passed), the table body, `TableLoading` skeleton (when `isFetching`), `NoDataFound`
   when empty, and `Pagination` (only when `meta.totalPages > 1`). Optional `expandable` config
   renders nested `DataTableSubRows`.
3. **`<resource>-columns.tsx`** — columns are defined as `DataTableColumn<T>[]` in a sibling file,
   exported either as a const or as a **factory taking row handlers** (`brandColumns({ handleEdit, handleDelete })`).
   A column with no `cell` falls back to `row[col.key]`, and `align` / `width` / `headerClassName`
   cover the common layout tweaks without a per-table wrapper.

The canonical wiring (see `src/features/brands/components/brand-table.tsx`):

```tsx
const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
const { data, isFetching } = useAllBrandQuery(filters.queryParams as Record<string, string>);

<DataTable
  columns={brandColumns({ handleEdit, handleDelete })}
  data={data?.result || []}
  rowKey={(row) => row.id}
  isFetching={isFetching}
  filters={filters}          // drives toolbar + pagination
  meta={data?.meta}          // server pagination envelope
  sortByOptions={categorySortOptions}
/>
```

Sort dropdown options are shared presets in `src/shared/constants/sort-options.ts`. Row-level
edit is commonly driven by a URL param (`?id=…`) opening a `TDSheet`, and delete by local state
opening a `TDModal`.

**The toolbar takes any number of filters — never hand-roll a select beside a table.** Declare the
extra query params as `defaultFilters` on the hook and describe them as `toolbarFilters` on the
table; the hook keeps each one in the URL, adds it to `queryParams`, clears it on reset and counts
it in `activeFilterCount`, and the toolbar renders it as a labelled pill plus a removable chip.

```tsx
const filters = useTableFilters({
  defaultSortBy: "createdAt:desc",
  defaultFilters: { status: "" },   // query-param name -> default value
});

<DataTable
  title="Listing moderation"          // header strip: accent bar + icon + description
  description="Approve a listing to let its store publish it."
  icon={Package}
  actions={<TDButton size="sm">Add product</TDButton>}
  toolbarFilters={[{ key: "status", label: "Status", icon: BadgeCheck,
                     allLabel: "All statuses", options: statusOptions }]}
  emptyState={{ title: "No listings yet" }}
  …
/>
```

An empty filter value is **dropped from `queryParams`** on purpose: the backend turns any unknown
key into a `where` clause, so `status: ""` would match nothing rather than meaning "all". The
toolbar's "All" option therefore writes `""`, which also deletes the param from the URL.

`ahooks` / `@ahooks.js/use-url-state` are in `package.json` but **unused** — URL state is hand-rolled
in `useTableFilters` with `next/navigation` + `use-debounce`. Don't introduce a second mechanism.

### Redux store
`src/store/store.ts` combines `baseApi.reducer` with a `cart` slice that is **persisted to
localStorage** via `redux-persist` (only the cart is persisted; redux-persist actions are excluded
from the serializable check). Cart logic and selectors live in `src/features/cart/store/cart.slice.ts` — cart
items are keyed by `productId` + `variantId`. Use the typed hooks in `src/store/redux.hooks.ts`.

### Providers
`src/app/layout.tsx` wraps everything in `Providers` (`src/providers/providers.tsx`):
Redux `Provider` → NextAuth `SessionProvider` → `AuthSync` → redux-persist `PersistGate`. A global
`sonner` `<Toaster />` is mounted here; **all user feedback goes through `toast` from `sonner`.**

### API responses & types
Backend responses follow the `TServerResponse<T>` envelope
(`src/shared/types/common.types.ts`): `{ success, message, meta?, result }`, where `meta` is
`TMetaData` (`currentPage`, `totalPages`, `totalData`, `hasNextPage`, `hasPreviousPage`).
Per-domain types live in `features/<feature>/types/*.types.ts` and are prefixed `T` (`TBrand`, `TOrder`).

## UI conventions

- **shadcn/ui** (new-york style, `src/shared/ui`) + Tailwind CSS v4 (config-less; the whole theme
  is `@theme inline` + CSS variables in `src/app/globals.css`). `cn()` from `src/shared/lib/utils.ts` merges classes.
- The theme defines full **numeric scales** — `primary-50…900`, `success-*`, `warning-*`,
  `destructive-*` — so use `bg-primary-400`, `text-success-600`, etc. rather than inventing raw
  color values. Colors are authored in `oklch`.
- **`TD*` prefix marks the project's own wrappers**, and you should reach for these instead of the
  raw Radix/shadcn primitive:
  - `src/shared/form/TDInput|TDSelect|TDCombobox|TDCheckbox|TDRadioGroup|TDTextArea|TDRating|TDImageUpload`
    — react-hook-form-bound fields. They all take `form={hookForm}` + `name` and render the
    shadcn `FormField`/`FormMessage` scaffolding themselves.
  - `TDButton` (`shared/components/td-button.tsx`) adds `isLoading` + spinner; `TDSheet`, `TDDrawer`,
    `TDPopover`, `TDModal` (`shared/components/td-modal.tsx`) wrap the overlay primitives.
- Forms use **react-hook-form + zod** (`@hookform/resolvers`). Each form is a presentational
  component taking `defaultValues` / `onSubmit` / `isSubmitting` so create and update pages share it
  (`features/<feature>/components/`), with the zod schema co-located in
  `schemas/<resource>-form.schema.ts` and its inferred type exported as `T<Resource>FormValues` — those
  inferred types double as the RTK Query mutation payload types.
- Status pills go through `StatusBadge` / `getStatusBadge` (`shared/ui/status-badge.tsx`) driven
  by the maps in `features/orders/constants/status-maps.ts` (`orderStatusMap`, `paymentStatusMap`).
- Other libraries in use: `lucide-react` icons, `motion` for animation, `recharts` for dashboard
  charts, `embla-carousel` for carousels, `vaul` for drawers, `moment` (via `lib/format-date-time.ts`)
  for dates, `@react-pdf/renderer` for order invoices (`features/orders/components/order-pdf/`).

### Image uploads
`src/shared/utils/upload-to-cloudinary.ts` posts directly to Cloudinary with an unsigned preset into
`trendora/<folder>`, returning `{ url, publicId }`. The preset puts them in a **temp folder
first** — the resulting publicId is `trendora/temp/<folder>/<id>`, with `temp` as the *second*
segment, not the last:
`TDImageUpload` stores both `urlName` and `publicIdName` form fields and, whenever an image is
replaced or removed, calls `deleteTempImage` (`src/shared/lib/delete-temp-image.ts` → backend
`/cloudinary/delete-temp`) **only if the current `publicId` contains `/temp/`**. Preserve that
guard — the backend promotes the image out of `temp/` on save, and deleting a promoted image would
destroy a live asset. Client-side limit is 2MB. `next.config.ts` allows any https image host.

`deleteTempImage` is a raw `fetch` that sends **no `authorization` header** — one of the two
deliberate exceptions to "all server data goes through RTK Query". The backend route is
correspondingly unauthenticated, so adding a guard there without also sending the token here breaks
every image replace and remove. See `docs/FEATURE-GAPS.md` XR-notes and the backend's BE-04.

## Known gaps

`docs/FEATURE-GAPS.md` is the prioritized audit of what is missing, stubbed or drifted from
the backend, with every item anchored to a `file:line`. Worth a glance before building a new
screen — several already have their RTK Query endpoint defined and unused, and `/products`,
the navbar search and the home page are much less finished than they look.

## Environment
Required env vars (`.env.local`):
- `NEXT_PUBLIC_BACKEND_URL` — backend API base URL (all RTK Query + auth calls target this).
- `NEXT_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — NextAuth.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_PRESET_NAME` — image uploads
  (read directly from `process.env`, not via `envConfig`).
- `NEXT_PUBLIC_TAX_RATE` — checkout math in `src/features/cart/utils/calculate-order-total.ts`
  (also exports `currencyFormatter`). Must match the backend's `TAX_RATE`.
- `NEXT_PUBLIC_SHIPPING_COST`, `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` — **fallbacks only.** Shipping
  is per store now and comes from each cart item's `vendorShippingFee` /
  `vendorFreeShippingThreshold`; these are used only for a cart persisted before the marketplace
  conversion, or a product payload missing its vendor.

Other public config is read through `src/shared/config/env-config.ts`.
