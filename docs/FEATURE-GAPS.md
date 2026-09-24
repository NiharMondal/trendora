# Feature Gaps & Technical Debt — Frontend

_Audited 2026-09-22 against `update-table-toolbar-and-page-restructuring` @ `4c17594`._
_Re-run this audit whenever the marketplace layer changes._

Every item below is anchored to a `file:line` that was read during the audit. Nothing here is
inferred — if a claim could not be verified in the source, it was dropped rather than guessed.

The companion document is `docs/FEATURE-GAPS.md` in the **backend** repo
(`github.com/NiharMondal/trendora-backend`). The **Cross-repo contract** section is mirrored in
both, written from each side's point of view.

## How to read this

| | |
| --- | --- |
| **P0** | Unsafe, or a headline feature that does not work. |
| **P1** | A user hits this in normal use. |
| **P2** | Polish, scale, or a feature that was never started. |

**Effort** — `S` under half a day · `M` one to two days · `L` more than two days.

IDs are stable. `FE-nn` is a frontend item, `XR-nn` a cross-repo contract item; the backend doc
uses `BE-nn` and the same `XR-nn` numbers.

---

## Summary

| ID | Title | Pri | Eff | Area |
| --- | --- | --- | --- | --- |
| ~~FE-01~~ | ~~`/products` has no filters, sort, search or pagination~~ | ✅ **FIXED** 2026-09-23 | — | storefront |
| ~~FE-02~~ | ~~Both navbar search boxes are inert~~ | ✅ **FIXED** 2026-09-23 | — | storefront |
| ~~FE-03~~ | ~~The home page renders only the hero slider~~ | ✅ **FIXED** 2026-09-23 | — | storefront |
| ~~FE-04~~ | ~~Forgot-password form submits to `console.log`~~ | ✅ **FIXED** 2026-09-24 | — | auth |
| ~~FE-05~~ | ~~No `error.tsx`, `not-found.tsx` or `loading.tsx` anywhere~~ | ✅ **FIXED** 2026-09-24 | — | robustness |
| ~~FE-06~~ | ~~Only one component in the app handles `isError`~~ | ✅ **FIXED** 2026-09-24 | — | robustness |
| ~~FE-07~~ | ~~Placeholder pages wired into live navigation~~ | ✅ **FIXED** 2026-09-24 | — | dashboard |
| ~~FE-08~~ | ~~`/admin/user-management` is empty; the real table is unlinked~~ | ✅ **FIXED** 2026-09-24 | — | admin |
| ~~FE-09~~ | ~~Hardcoded "Your Balance $12627" on every dashboard page~~ | ✅ **FIXED** 2026-09-24 | — | dashboard |
| FE-10 | Footer links to eight routes that do not exist (was nine) | P1 | M | storefront |
| FE-11 | Three admin dashboard widgets are demo fixtures | P1 | M | analytics |
| FE-12 | SEO metadata is on the wrong pages; none on the storefront | P1 | M | seo |
| FE-13 | No `sitemap.ts`, `robots.ts` or OpenGraph | P1 | S | seo |
| ~~FE-14~~ | ~~No admin hero-slider screen despite full CRUD API~~ | ✅ **FIXED** 2026-09-24 | — | admin |
| ~~FE-15~~ | ~~Five search boxes are silent no-ops~~ | ✅ **FIXED** 2026-09-24 | — | tables |
| ~~FE-16~~ | ~~Admin user actions — backend ready, UI not wired~~ | ✅ **FIXED** 2026-09-24 | — | admin |
| FE-17 | `next.config.ts` allows any https image host | P1 | S | security |
| ~~FE-18~~ | ~~No customer-facing refunds view~~ | ✅ **FIXED** 2026-09-24 | — | orders |
| ~~FE-19~~ | ~~No vendor store-review screen~~ | ✅ **FIXED** 2026-09-24 | — | vendor |
| ~~FE-20~~ | ~~Two wishlist pages, one of them an empty shell~~ | ✅ **FIXED** 2026-09-24 | — | storefront |
| ~~FE-21~~ | ~~Product reviews are not gated on purchase~~ | ✅ **FIXED** 2026-09-24 | — | reviews |
| ~~FE-22~~ | ~~Customer `/dashboard` is a link grid, not a dashboard~~ | ✅ **FIXED** 2026-09-24 | — | dashboard |
| FE-23 | 18 defined-but-never-called endpoints | P2 | M | api |
| FE-24 | Two RTK tags are never provided (the misdeclared one fixed in FE-14) | P2 | S | api |
| FE-25 | 1 orphaned component file (was 11) | P2 | S | cleanup |
| FE-26 | Five stray `console.log`s | P2 | S | cleanup |
| FE-27 | 39 `any`s, eight of them in type definitions | P2 | M | types |
| FE-28 | Duplicate type definitions across features | P2 | S | types |
| FE-29 | No `.env.example`; README is scaffold boilerplate | P2 | S | onboarding |
| FE-30 | No env validation — a missing tax rate silently means 0% | P2 | S | config |
| FE-31 | 13 raw `<img>` tags bypass `next/image` | P2 | S | performance |
| FE-32 | Accessibility: three `aria-*` attributes in the whole app | P2 | L | a11y |
| FE-33 | No test runner, no CI | P2 | L | ops |
| FE-34 | No vendor analytics, order detail or profile screens | P2 | M | vendor |
| FE-35 | No admin settings or vendor detail screens | P2 | M | admin |
| FE-36 | No coupon field, guest checkout, multi-currency or i18n | P2 | L | storefront |
| FE-37 | No category or brand browsing | P2 | M | storefront |
| FE-38 | No order tracking timeline or per-order invoice | P2 | M | orders |
| FE-39 | Committed build artefacts; no Prettier config | P2 | S | cleanup |

---

## P0 — headline features that do not work

### ~~FE-01~~ · `/products` has no filters, sort, search or pagination
**✅ FIXED 2026-09-23 · storefront**

**Was:** `product-wrapper.tsx:11` rendered the literal string `<div>Filter section</div>` and called
`useAllProductsQuery({})` with an empty object, destructuring `isLoading` and never using it.

**Now:** `product-wrapper.tsx` is a faceted catalogue — a sticky filter sidebar on `lg` and up, the
same panel inside a `TDSheet` below it, plus search, sort, pagination, a skeleton, an empty state
and an error state.

**The filter options come from the backend, not from this repo.** `GET /products/filters`
(`useProductFiltersQuery`) returns the categories, brands, sizes, genders, stores, price range and
rating buckets that actually exist in the live catalogue, each with a count. Both queries take the
**same** `queryParams`, so the counts narrow with the selection. That is what makes the panel
survive a marketplace where sellers list whatever they like: a vendor opening a new category makes
it appear in the panel with no frontend change. Counts are disjunctive server-side, so ticking one
brand does not zero out the others.

New/changed files:

- `features/products/hooks/use-product-filters.ts` — `useTableFilters` + multi-select. Its
  `PRODUCT_FILTER_KEYS` must mirror `STOREFRONT_FILTER_KEYS` in the backend's
  `helpers/product-filter.ts`.
- `features/products/types/product-filter.types.ts` — `TProductFacets`.
- `features/products/components/filters/` — `product-filter-panel`, `facet-section`,
  `price-filter` (rewritten), `rating-filter`, `active-filters`. The old `brand-filter`,
  `category-filter` and `size-filter` stubs were deleted; they hardcoded what the server now serves.
- `features/products/components/product-toolbar.tsx`, `product-grid-skeleton.tsx`.
- `shared/hooks/use-table-filters.ts` gained **`setFilters`** (several params in one URL write) —
  two `setFilter` calls in a tick both build from the same params snapshot, so a price min/max pair
  lost its min.
- `shared/constants/sort-options.ts` gained `storefrontSortOptions`.
- `app/(root)/products/page.tsx` wraps the wrapper in `<Suspense>`, which Next 15 requires for
  `useSearchParams` if the route is to stay statically rendered.

**Known limitation:** the price *filter* matches on the price the shopper is shown (discounted
where discounted), but the price *sort* orders by `basePrice` — Prisma cannot order by a
coalesced expression without a generated column, so a deeply discounted item sorts by its
pre-discount price. Noted on `storefrontSortOptions`.

---

### ~~FE-02~~ · Both navbar search boxes are inert
**✅ FIXED 2026-09-23 · storefront**

**Was:** `desktop-navbar.tsx:30` and `mobile-navbar.tsx:67` rendered a search input with no
`onChange`, no `onSubmit`, no `<form>` wrapper and no navigation.

**Now:** both are `<form role="search">` elements submitting through the shared
`layouts/navbar/use-navbar-search.ts`, which pushes `/products?search=<q>` — the param FE-01's
`useProductFilters` already reads. No API work was needed; the backend has searched `name` and
`description` all along.

Three decisions worth keeping:

- **The navbar box mirrors `?search=` in both directions.** The first cut kept local state only, to
  avoid a `useSearchParams` call in a layout-level component — and that shipped a bug: searching
  from the navbar and then clearing the catalogue toolbar left the navbar advertising a search that
  was no longer running. The URL is the single source of truth; the hook keeps a draft only for
  what has been typed and not yet submitted, reset on change **during render** rather than in an
  effect (an effect repaints the stale term for a frame; an unconditional assignment clobbers
  mid-word). Reading search params is safe here because `Navbar` lives in `app/(root)/layout.tsx`,
  not the global root layout, and `PersistGate loading={null}` already leaves every page with no
  meaningful prerendered HTML — `/about-us`, `/cart`, `/checkout` and `/products` all remain
  `○ Static` in the build output.
- **A navbar search starts a fresh result set.** It pushes the bare path plus `?search=`, which
  clears whatever brand/price filters the shopper left on `/products`. An empty submit therefore
  means "show me everything", not a no-op.
- **`onMouseDown` preventDefault on the desktop submit button.** Found while verifying: pressing
  the button blurred the input, which collapsed the button from ~110px to 40px *between* mousedown
  and mouseup, so the mouseup landed outside it and **clicking Search did nothing**. Only the Enter
  key worked. Keeping focus through the press is what fixes it; the two-branch `{focused ? … : …}`
  button was also merged into one so its DOM node survives the state change.

Also fixed in passing: the mobile search trigger was a click handler on a bare `<Search>` SVG, so
mobile search was unreachable by keyboard. It is a `<button aria-label="Open search">` now, the
panel autofocuses its input, and Escape closes it.

---

### ~~FE-03~~ · The home page renders only the hero slider
**✅ FIXED 2026-09-23 · storefront**

**Was:** `(root)/page.tsx` rendered `<HeroSlider />` and nothing else, above five orphaned
components. Only one of those five actually worked — `featured-product.tsx` was an empty grid,
`showcase.tsx` was three hardcoded "Hello World" cards, and `trending-product.tsx` read
`mock-products.ts` with `ProductCard` commented out. This was a build, not a wire-up.

**Now:** ten sections, composed in `(root)/page.tsx`:

```
HeroSlider → TrustStrip → CategoryTiles → DealsRail → PromoBanner
           → BestSellersRail → NewArrivalsRail → TopRatedRail → BrandStrip → TopStores
```

The ordering is the design, not the count. Four product rails stacked together read as one
scroll and the lower ones never get seen, so they are broken up by the tiles and the full-bleed
banner, closing on the sellers — the one section a single-vendor shop could not have.

**Every section renders `null` when it has no data.** A marketplace with no completed orders has
no best sellers and shows nine sections, not ten; one with no markdowns has no deals. A confident
heading over an empty shelf reads as a broken page. This is also why each rail fetches its own
data — the decision to disappear has to happen after the fetch, not in the page that composes them.

New files under `features/home/components/`: `product-rail.tsx` (the shared carousel, used by four
sections), `rails.tsx` (the four queries bound to it), `trust-strip.tsx`, `category-tiles.tsx`,
`brand-strip.tsx`, `top-stores.tsx`, `promo-banner.tsx`. The five orphans were deleted.

**Category tiles come from `GET /products/filters`, not `GET /categories`** — deliberately. The
taxonomy is admin-owned and aspirational: it carries Belt, Bag, Heels, Dress and a dozen more
nobody has listed a product in. Tiling all of them handed the shopper seventeen doors, most opening
onto "no products found". The facets endpoint returns only categories with live stock, with counts.

**Backend work this needed** (repo `trendora-backend`, branch `BE-home-storefront-sections`):

| | why |
| --- | --- |
| `?onSale=true` | `discountPrice IS NOT NULL` cannot be expressed as a column filter. Also adds a real "On sale" checkbox to `/products`. |
| `GET /products/best-sellers` | `topProducts` existed only inside **admin-only** `GET /orders/analytics`. Ranks by units sold over 90 days, excluding cancelled parcels, re-filtered through `publicProductFilter`. |
| `Category.image` + `imagePublicId` | Migration, validation, Cloudinary temp-folder handshake, and the upload field in the admin category form. |
| `categoryId` matches self **or children** | Found in verification: products hang off leaf categories, so tiles linking to "Footwear" returned 0 results and the active-filter chip rendered a raw UUID. |

**Also fixed in passing:** `ProductCard` rendered a broken frame for a row whose image URL no longer
resolves. One seeded product has a `/temp/` publicId whose asset has since been deleted — the
backend's BE-41 hazard, in live data. The card now falls back to a "No image" placeholder.

**Known data artifacts, not bugs:** Best sellers is hidden because the database has zero orders
(the ranking was verified against temporary rows, then cleaned up). Top rated shows a single
product because only one has a rating — the rail fills as reviews arrive.

---

### ~~FE-04~~ · The forgot-password form submits to `console.log`
**✅ FIXED 2026-09-24 · auth**

**Was:** `forgot-password-form.tsx:24` was `const onSubmit = (data) => { console.log(data); }`, and
the `/reset-password` page the emailed link points at did not exist.

**Now:** both halves of XR-11 are built.

- `auth.api.ts` gained `forgotPassword` and `resetPassword` mutations.
- `forgot-password-form.tsx` posts the email and swaps the form for a "Check your inbox" state
  that renders the backend's generic message **verbatim**. It never branches on whether the account
  exists. The confirmation copy tells Google-only users to use the Google button.
- `app/(auth)/reset-password/page.tsx` reads `?token=` server-side and renders
  `reset-password-form.tsx`. Its schema is `reset-password.schema.ts`: it mirrors the backend
  `passwordRule` (6–30 characters, one letter, one number) and adds a confirm field checked only
  here. A 400 (invalid, expired or used token) and a missing token both show the backend's
  message plus a link back to `/forgot-password`. On success the page shows a toast and goes to
  `/login`. It does not auto-login.

**Deviation from XR-11 step 4 (deliberate):** `/reset-password` was **not** added to
`auth-sync.tsx`'s `PUBLIC_AUTH_PATHS`. That list holds the pages that *redirect signed-in users
away*, so adding it would cause the very bounce step 4 set out to prevent. Keeping it off the list,
and outside the `middleware.ts` matcher, is what lets a signed-in user follow the link.

---

### ~~FE-05~~ · No `error.tsx`, `not-found.tsx`, `loading.tsx` or `global-error.tsx` anywhere
**✅ FIXED 2026-09-24 · robustness**

**Was:** none of the four existed, so a render throw showed a blank screen in production and every
bad URL got the stock Next 404.

**Now:**

| File | Catches / shows |
| --- | --- |
| `app/global-error.tsx` | a throw in the root layout or `Providers`. It replaces the layout, so it renders its own `<html>`/`<body>`, imports `globals.css` itself and uses plain `<a>` links (a full reload). |
| `app/error.tsx` | a throw in any route-group **layout**. A group's own `error.tsx` sits inside that layout, so it cannot catch it. |
| `app/(root)/error.tsx` | storefront pages. The navbar and footer stay. |
| `app/(auth)/error.tsx` | auth pages. Links back to `/login`. |
| `app/(dashboard)/error.tsx` | dashboard pages. The sidebar stays, and it links to `roleHomePath(role)`. |
| `app/not-found.tsx` | every unmatched URL, in every group. It has its own minimal header, because it renders outside all group layouts. |
| `app/(root)/loading.tsx`, `(dashboard)/loading.tsx`, `(auth)/loading.tsx` | skeleton/spinner feedback on navigation. `/login` awaits `getServerSession`. |

All four `error.tsx` files render the shared `shared/components/error-state.tsx`. Its "Try again"
button calls `router.refresh()` and then `reset()` inside a transition. `reset()` on its own only
re-renders the client tree, so it can never recover an error thrown by a server component. The
`digest` is shown as an "Error reference", so a user's report can be matched to the server log.

`pnpm build` still reports `/`, `/products`, `/cart` and `/about-us` as `○ Static`. Verified
against `pnpm start`: `/faq` returns 404 with the branded page.

**Still open:** nothing calls `notFound()`. A bad `/products/<slug>` or `/stores/<slug>` matches a
real route and renders client-side, so it answers 200 with FE-06's inline "not found" state, not
this page.

---

### ~~FE-06~~ · Only one component in the entire app handles `isError`
**✅ FIXED 2026-09-24 · robustness**

**Was:** the only `isError` read was `vendor-dashboard.tsx:30`, and even that one got it wrong: any
failure rendered "No store yet — Apply now", so a network blip told an approved seller to apply
to sell. Its "Apply now" button also did nothing, because `NoDataFound` renders the action only
when `onAction` is passed as well. Everywhere else, a failed request looked exactly like an empty
list. `admin/product-list/[id]/page.tsx` returned `undefined` while loading and then **threw** on a
product with no images (`images[selectedImage].url`).

**Now there is one pattern, in three pieces:**

- **`shared/utils/api-error.ts`**: `getApiErrorStatus(error)` returns the HTTP status, or
  `undefined` when the server never answered. `getApiErrorMessage(error, fallback)` returns the
  backend's `message` from the error envelope. When the request never reached the server it says
  that, rather than "Something went wrong". Also `isNotFoundError(error)`. This is the helper FE-27
  asks for.
- **`shared/components/query-error.tsx`** (`QueryError`) is the inline "this request failed"
  state: the backend's message plus a "Try again" button wired to the hook's `refetch`. An optional
  `notFound` prop gives a 404 its own copy and no retry, because a missing record is not a failure.
- **`DataTable` takes `error` and `onRetry`.** It renders `QueryError` instead of rows **even
  when stale `data` from a previous page is still cached**. RTK Query keeps the last good result, so
  a failed page 2 would otherwise still show page 1's rows. Pagination is hidden while in the error
  state.

**Where it is applied:**

| | |
| --- | --- |
| Tables | all 18 `DataTable` consumers pass `error={listError} onRetry={refetchList}`. `order-table.tsx` fed `isLoading` into `isFetching`, so a retry or page change showed no skeleton; fixed. `recent-orders-table.tsx` had no loading state at all; fixed. |
| Detail pages | `(root)/products/[slug]`, `admin/product-list/[id]` (plus the image crash: a "No image" placeholder), `store-front.tsx` (the store and, separately, its product grid) and `order-details.tsx`. Each shows "not found" copy on a 404 and a retry otherwise. |
| Edit forms | brand, category, size, size group, review, `update-product`, `vendor-update-product`, `profile-component` and `store-settings-form`. **A failed load no longer renders the form.** Its blank defaults would have been saved over the real record. `profile-component` also gained the loading gate it never had. |
| Lists and widgets | wishlist, addresses, store directory, outstanding balances, featured table and `marketplace-overview`, which rendered every tile as `0` on failure. |
| `vendor-dashboard.tsx` | a **403** shows the backend's message verbatim. `requireApprovedVendor` sends an actionable one for each case: no store, pending, rejected (with the reason) or suspended. It comes with a working link to `/vendor/apply`. Any other failure is a real error with a retry. |

Render-time throws are a separate concern and belong to the FE-05 boundaries. `QueryError` is for
the part of a page that a query feeds.

**Deliberately left:**

- The home-page sections still render `null` on failure. They self-hide by design, and one
  missing shelf is better than an error box on the landing page.
- Option lists inside forms (category, size, product and billing selects) still show an empty
  dropdown when their request fails.
- Nothing calls `notFound()` (see FE-05).

---

## P1 — a user hits this

### ~~FE-07~~ · Placeholder pages wired into live navigation
**✅ FIXED 2026-09-24 · dashboard**

**Was:** four routes rendered a bare word: `/admin/hot-offers` (`<div>HotOffers</div>`, with a
sidebar row), `/admin/order-history` (orphaned), `/categories/[slug]` (`<div>page</div>`) and
`/about-us` (`<div>AboutUs</div>`, linked from the footer).

**Correction to the original audit:** `/categories/[slug]` was **not** "on every category link on
the storefront". Since FE-03, the home-page tiles link to `/products?categoryId=<id>`, and nothing
in `src/` linked to `/categories/…`. It could only be reached by typing the URL.

**Now:**

| Route | Resolution |
| --- | --- |
| `/admin/hot-offers` | **Deleted**, along with its `dashboard-navlink.ts` row and the `Coffee` icon import. The backend has no offers concept beyond a product's `discountPrice`, and markdowns already surface on the storefront (`?onSale=true`, `DealsRail`). If an admin promotions screen is wanted, it needs a backend model first (BE-29 covers coupons). |
| `/admin/order-history` | **Deleted.** The sidebar's "Order History" row already points at the real `/admin/order-list`. |
| `/categories/[slug]` | **A readable alias for the catalogue, not a second product list.** `features/categories/components/category-redirect.tsx` resolves the slug through `GET /categories?slug=<slug>`, because `GET /categories/:id` takes an id only and the list endpoint's generic column filter does the lookup. It then `router.replace`s to `/products?categoryId=<id>`, which already has the facets, sort, search and pagination, and matches the category *or its children*. An unknown slug shows "Category not found" with a "Browse all products" action, and a failed lookup shows `QueryError`. |
| `/about-us` | **Built:** `features/home/components/about-us.tsx`. A hero, "How it works" (independent reviewed stores, one checkout with per-store shipping, per-parcel tracking and cancellation with automatic refunds), the home page's `TrustStrip`, and a "Sell on Trendora" CTA to `/vendor/apply`. Every claim describes behaviour the code implements, and there are no invented figures. It has page `metadata` and is still `○ Static`. |

**Not verified live:** the slug lookup was not exercised against a running backend. It relies on
`PrismaQueryBuilder.filter()`, which `category.service.ts` applies to the list read.

---

### ~~FE-08~~ · `/admin/user-management` is empty; the working table is unlinked
**✅ FIXED 2026-09-24 · admin**

**Was:** the sidebar target `/admin/user-management` rendered only a `<Headline>`. A hand-rolled
table lived at the unlinked `/admin/user`, and the `DataTable` version,
`user-management-table.tsx`, was orphaned. That makes three implementations of one screen.

**Now:**

- `/admin/user-management` renders `UserManagementTable`: the shared `DataTable` with a header
  strip, URL-synced search, sort and pagination, and the FE-06 error state.
  `user-management-table.tsx` also gained the `"use client"` it lacked. It uses hooks and had never
  been mounted, so nothing had noticed.
- **`/admin/user` is deleted.** It hand-rolled its own table, `Select`, `Input` and `Pagination`.
  It rendered `NoDataFound` for a search with no results, which hid the search box that caused it.
  It showed a fabricated `"Dhaka, Bangladesh"` on every row, and its Eye and Block buttons did
  nothing.
- **`user-management-columns.tsx` was rewritten.** It has four columns: an avatar with an initial
  fallback (it had been `<img src="">`), name and email, phone, a role pill, and joined date. Its
  Edit and Delete buttons had no handlers and were removed. Real actions arrived in FE-16.
- **`TUser.email` and `TUser.role` are `string | null`**, per the XR-05 caveat. A user with no
  `Auth` row renders "No login credentials" and a `-` role.
- The search placeholder now says what the backend searches: name, email and phone.

The lint baseline dropped to 50, because the deleted page carried a raw `<img>` warning.

---

### ~~FE-09~~ · Hardcoded "Your Balance $12627" on every dashboard page
**✅ FIXED 2026-09-24 · dashboard**

**Was:** `(dashboard)/layout.tsx` put a fabricated "Your Balance **$12627**" in the chrome of every
dashboard route, for admins, vendors and customers alike. Beside it were a "Search anything…"
input with no handler and a `cursor-pointer` notification bell with no handler.

**Now:**

- **The balance is real and vendor-only.** `layouts/dashboard/vendor-balance.tsx` is mounted only
  when the session role is `VENDOR`. It shows `availableForPayout` from `useMyBalanceQuery`
  (`GET /payouts/me/balance`) and links to `/vendor/payouts`. That figure is money from delivered,
  paid parcels not yet in a payout, with commission and tax already removed, so it is what the store
  will actually be paid. Admins and customers see nothing, because they have no balance.
  - It renders `null` on error. The backend 403s a pending, rejected or suspended store, and the
    vendor dashboard already explains that (FE-06).
  - It shows a small skeleton while loading.
- **The search input was removed**, not wired. `useNavbarSearch` pushes `/products?search=`, which
  would throw an admin out of the dashboard into the storefront. Every dashboard table already has
  its own URL-synced search.
- **The bell was removed.** There is no notifications backend.

A VENDOR sees their balance on `/dashboard/*` (their shopper pages) too. That is deliberate: it
is the same person, and it is still true there.

---

### FE-10 · The footer links to eight routes that do not exist (was nine)
**P1 · M · storefront**

**Now:** `src/shared/constants/footer.ts` lists `/shipping-and-return` (:3), `/contact-us` (:4),
`/not-found` (:5), `/maintenance` (:6), `/faq` (:10), `/privacy-policy` (:11), `/cookie-policy`
(:12, twice), `/terms-and-conditions` (:13) and ~~`/dashboard-wishlist` (:19)~~ (typo fixed in FE-20).

**Gap:** Every one is a 404 — now at least the branded `not-found.tsx` (FE-05). The last
is a typo for `/dashboard/wishlist`. A site with no privacy policy or terms page is also a
compliance problem before launch.

**Fix:** ~~Fix the `/dashboard-wishlist` typo~~ (done in FE-20). Write the four legal/help pages
(privacy, terms, cookies, FAQ) and a contact page. Delete the `/not-found` and `/maintenance`
entries — those were demo links to template pages.

---

### FE-11 · Three admin dashboard widgets are demo fixtures
**P1 · M · analytics**

**Now:**
- `src/features/analytics/components/order-chart.tsx:11-54` — seven recharts demo rows
  (`{name: "Page A", uv: 4000, pv: 2400}`), titled "Recent Orders".
- `src/features/analytics/components/top-products.tsx:6-49` — an `INV001…INV007` invoice fixture,
  with `"Product name here"` hardcoded at `:69`.
- `src/features/analytics/components/products-overview.tsx:13-56` — the same fixture, plus
  hardcoded `9481324190`, `$11.32`, `121` and `Available` at `:86-91`.

**Gap:** The admin's first screen mixes real numbers with invented ones and gives no signal which
is which. `MarketplaceOverview` beside them is real (`useOrderAnalyticsQuery`), which makes the
fixtures more misleading, not less.

**Fix:** Back them with real endpoints, or remove them until an endpoint exists. Note the backend
has only two analytics endpoints (`GET /orders/analytics`, `GET /vendors/me/dashboard`) and
neither returns a time series — a real order chart needs backend **BE-37** first.

**Correction:** the root `CLAUDE.md` also lists `RecentOrdersTable` and `NewComments` as mock.
That is **stale** — both now use real RTK Query hooks
(`recent-orders-table.tsx:8`, `new-comments.tsx:8`). Only the three above are fixtures.
`new-comments.tsx:30` does still fall back to the shadcn demo avatar.

---

### FE-12 · SEO metadata is on exactly the wrong pages
**P1 · M · seo**

**Now:** 18 of 58 pages export `metadata`, and they are **almost all `(dashboard)` pages** — which
should never be indexed. The public storefront pages that need it have none: `(root)/page.tsx`,
`products/page.tsx`, `products/[slug]`, `categories/[slug]`, `stores/[slug]`, `cart` (`about-us` has had `metadata` since FE-07).
There is no `generateMetadata` anywhere, and the storefront detail pages are `"use client"`
(`src/app/(root)/products/[slug]/page.tsx:1`), so they cannot produce per-item titles as written.
The root description is still `"Generated by create next app"` (`src/app/layout.tsx:24`).

**Gap:** Every product and store shares one generic title and the scaffold description. For a
storefront whose traffic depends on product pages ranking, this is a significant miss.

**Fix:** Add `generateMetadata` to `products/[slug]` and `stores/[slug]` (`categories/[slug]` only redirects, so it needs none),
which means splitting each into a server page shell plus the existing client component — the
`src/app` convention already expects the page to be a thin shell. Add `metadataBase` and a real
root description. Mark the dashboard route groups `robots: { index: false }`.

---

### FE-13 · No `sitemap.ts`, `robots.ts` or OpenGraph
**P1 · S · seo**

**Now:** None of the three exist anywhere under `src/app`. No `opengraph-image`, no Twitter card,
no canonical URLs.

**Fix:** Add `src/app/sitemap.ts` generating entries from the products, categories and stores
endpoints, `src/app/robots.ts` disallowing `/admin`, `/vendor` and `/dashboard`, and a default
`opengraph-image`. Best done alongside FE-12.

---

### ~~FE-14~~ · No admin hero-slider screen, despite a complete CRUD API
**✅ FIXED 2026-09-24 · admin** (backend half: **BE-43**, branch `BE-slides-admin`)

**Was:** `slide.api.ts` defined create/by-id/update/delete and nothing imported them. There was no
route and no sidebar entry, so the storefront hero could only be changed in the database.

**The API was not in fact complete.** The audit's "backend is ready" was wrong in one way that
mattered. `Slide` stored a bare `photoUrl` with no publicId, and nothing promoted an upload out
of Cloudinary's `temp/`. Wiring `TDImageUpload` to it would have saved every new banner as a
`temp/` asset, which anyone can delete through the unauthenticated `/cloudinary/delete-temp`
(BE-41). `PATCH /slides/:id` was also unvalidated. Both were fixed backend-side first (**BE-43**).
**Writes now send `photo: { url, publicId }`, not `photoUrl`.**

**Now:**

- **`/admin/slide-list`** (`features/home/components/slides/slide-table.tsx`) reads the new
  `allSlidesForAdmin` endpoint (`GET /slides/admin/all`), so hidden slides stay manageable.
  - It is a `DataTable` sorted by display order, with a Live/Hidden toolbar filter
    (`?isActive=`, which the query builder coerces to a boolean) and search over title and
    subtitle.
  - Each row has a thumbnail. The row menu offers Edit (a `TDSheet` driven by `?id=`), Hide/Show
    (a one-field `PATCH` of `isActive`) and Delete (confirmed in a `TDModal`, whose copy points at
    Hide for a temporary takedown).
- **`/admin/add-slide`** (`add-slide.tsx`) uses the shared `slide-form.tsx`:
  - title, subtitle and button link (a `/path` or `http(s)` URL);
  - sort order and "Show on the storefront";
  - `TDImageUpload` into `slides/`.
  - `slide-form.schema.ts` mirrors the backend `slideSchema` exactly.
  - The form resets only after a **successful** save. The brand form resets and closes even when
    the save fails.
- **`edit-slide.tsx`** does not render the form on a failed load (FE-06). An image hosted
  elsewhere (the seeded Unsplash banners) round-trips with an empty `publicId`.
- **Sidebar:** a "Hero Slides" row with Slides / Add Slide tabs.
- **`TSlide`** gained `photoPublicId`, `sortOrder` and `isActive` (XR-05).
- **`slideById` provided the `products` tag.** It provides `slides` now (FE-24).

**Verified:** `pnpm lint` (50 warnings, unchanged) and `pnpm build` pass. Every request shape this
screen sends was exercised against the live backend: create, admin list with an inactive slide,
the `isActive` toggle, validation errors and 401 without a token.

**Not verified:** the screen was not clicked through in a browser, and a real upload's `temp/`
promotion could not be run from the sandbox, which cannot reach Cloudinary. Add one slide with an
uploaded image and check that the stored `photoPublicId` contains no `/temp/`.

---

### ~~FE-15~~ · Five search boxes are silent no-ops
**✅ FIXED 2026-09-24 · tables** (backend half: **BE-44**, branch `BE-list-search`)

**Was:** the admin orders, my-orders, admin payouts, vendor payouts and refund console tables all
sent `?search=`. `order.service.ts`, `payout.service.ts` and `refund.service.ts` never called
`PrismaQueryBuilder.search()`, so the unfiltered list came back and no error was reported. **The
audit missed a sixth:** the vendor's own order table (`vendor-order-table.tsx`) had the same
problem.

**Fixed backend-side, as the audit recommended.** Each list now calls `.search()`, and
`search()` relation paths nest (`user.auth.email`). See BE-44 for the per-endpoint fields and
the live verification, including the check that a vendor's search cannot reach another store's
parcels.

**Here:** each placeholder now says what the box actually searches. The old ones promised things
the backend never matched. The admin orders box said "Search by name", for example.

| Table | Placeholder |
| --- | --- |
| `order-table.tsx` (admin) | Search order number, buyer name or email... |
| `my-orders-list.tsx` | Search by order number... |
| `vendor-order-table.tsx` | Search order or parcel number, tracking, buyer... |
| `payout-admin-table.tsx` | Search store, reference, method or notes... |
| `vendor-payouts.tsx` | Search reference, method or notes... |
| `refund-admin-console.tsx` | Search order or parcel number, Stripe refund id, reason... |

**Keep them in step:** a placeholder is a claim about the backend's `.search()` field list. Change
one, change the other.

---

### ~~FE-16~~ · Admin user actions
**✅ FIXED 2026-09-24 · admin** (backend half: **BE-45**, branch `BE-user-admin-list`)

**Was:** the Eye and Block buttons on `/admin/user` had no `onClick`. FE-08 removed them and left
the table read-only, although BE-34 had shipped disable, restore and role change.

**Found while building it:** restore was unreachable. `GET /users` applied
`withDefaultFilter({ isDeleted: false })`, and the query builder ANDs the default with everything
else. So `?isDeleted=true` asked for `isDeleted: false AND true` and matched nothing: a disabled
account could never be listed, and so never restored. This was fixed backend-side as **BE-45**.

**Now**, in `/admin/user-management`:

- **Row actions** (`user-management-columns.tsx`, now a factory taking handlers):
  - An active user gets a menu with **Change role** and **Disable**.
  - A disabled user gets a **Restore** button.
  - **The signed-in admin's own row shows "You" and no actions.** The backend refuses self-disable
    and self re-role anyway. `session.user.id` is the User id (`auth.userId`), the same id
    `assertNotSelf` compares.
- **A Status toolbar filter** switches between active accounts (the default, `""`) and **disabled
  accounts** (`?isDeleted=true`). Search works inside either list.
- **Disable** is confirmed in a `TDModal` that states the consequences. The user is out on their
  next request. **A seller's store is suspended and its listings leave the storefront.** Restoring
  the account does not reinstate the store.
- **Restore** has a confirm that repeats the store caveat.
- **Change role** offers only CUSTOMER and ADMIN (`TAssignableRole`). VENDOR is deliberately
  absent: the backend accepts it only for an account that already has an approved store, and store
  approval sets it anyway. Choosing ADMIN shows a warning line. A row with no `Auth` record
  (`role: null`) has the action disabled.
- Every refusal is shown **verbatim** through `getApiErrorMessage`. The backend's are actionable,
  for example "This account still owns an approved store. Suspend the store first".
- `user.api.ts`: `deleteUser` became **`disableUser`**. It invalidates `vendors` too, because it
  can suspend a store. New mutations are **`restoreUser`** and **`updateUserRole`**.
  `TUser.isDeleted` was added.

**Verified live**, reversibly, against the seeded accounts. 14 of 14 checks passed:

- Self-disable and self re-role are refused.
- Demoting vendor1 is refused while their store is approved.
- A bad `isDeleted` value gets a 400.
- The customer was disabled: they dropped out of the active list, appeared under Disabled (and
  were searchable there), and could not log in. They were then restored and could log in again.
- CUSTOMER → ADMIN → CUSTOMER round-trips.

The end state was identical to the start. The screens were not clicked through in a browser.

**Rough edges left:**

- A disabled user's login error reads "User has been deleted". That is backend copy, and the
  account is disabled, not deleted.
- The demote refusal quotes an API path (`PATCH /vendors/:id/suspend`) at the admin. A link to the
  vendor list would serve them better.

---

### FE-17 · `next.config.ts` allows any https image host
**P1 · S · security**

**Now:** `next.config.ts:6` — `remotePatterns: [{ hostname: "*", protocol: "https" }]`.

**Gap:** The Next image optimizer will fetch and re-serve an image from **any** https origin on
the internet, on request. That is an open proxy: a bandwidth and cost vector, and a way to launder
third-party content through your domain.

**Fix:** Restrict to the hosts actually used — `res.cloudinary.com`, `lh3.googleusercontent.com`
for Google avatars, and `github.com` if the shadcn fallback avatar stays. Add `formats` and
`deviceSizes` while there.

---

### ~~FE-18~~ · No customer-facing refunds view
**✅ FIXED 2026-09-24 · orders** (backend half: **BE-46**, branch `BE-refunds-buyer-scope`)

**Was:** `useMyRefundsQuery` was defined and used by nothing. A buyer whose parcel was cancelled
could only see the refund as an inline badge on `my-orders-list.tsx`. There was no list and no
history.

**Found while building it:** for a **VENDOR**, `GET /refunds/me` returned refunds on parcels they
*sold*. It had no way to return refunds on orders they *bought*. A vendor is a shopper (their
sidebar already links to `/dashboard/my-orders`), so a shared "My refunds" page would have shown a
seller the wrong list, and their own refunds could not be listed at all. The backend fix is
**BE-46**: an explicit `?as=buyer|seller`.

**Now:**

- **`/dashboard/my-refunds`** (`features/refunds/components/my-refunds-list.tsx`) is a
  `DataTable` with search by order or parcel number, a Status toolbar filter, pagination and the
  FE-06 error state. **It always sends `as: "buyer"`.**
  - It shows the parcel number and "Shipped by <store>" ("Whole order" for an order-level manual
    refund), the amount, the status, where it went (original card / cash / bank transfer), and the
    requested and completed dates.
- **Buyer-worded statuses** live in `features/refunds/constants/buyer-refund-status.ts`. The
  existing `refundStatusMap` is the operator's vocabulary ("Owed", "Abandoned"). The buyer's map
  is Processing, On its way, Refunded, **Delayed** and Not refunded. Each has a one-line hint
  under the badge.
  - **FAILED reads as "Delayed — our team can see this", never as settled.** A cancelled parcel
    with a failed refund is a buyer who has not been paid. The hint does not promise an automatic
    retry, because nothing schedules the retry sweep (see `backend/CLAUDE.md`).
- **Sidebar:** "My Refunds" is in **both** `customerDashboardLinks` and `vendorDashboardLinks`,
  next to My Orders.

**Verified live.** vendor1, shopping, placed a cash-on-delivery order from **vendor2's** store and
cancelled it. The admin recorded a manual refund on that parcel. 13 of 13 checks passed:

- vendor1 `as=buyer` sees it, and vendor1's default seller view does not.
- vendor2 (the seller) sees it, and vendor2 `as=buyer` does not.
- The customer sees nothing.
- A customer asking `as=seller` gets a 403, and `as=bogus` gets a 400.
- Search by parcel number and `status=SUCCEEDED` / `FAILED` narrow correctly.
- The row carries the parcel, the store and `gateway: "cash"`, and does not include
  `gatewayResponse`.

Everything was deleted afterwards, and stock was confirmed back at its starting value. The page was
not clicked through in a browser.

**Still open:** a **seller-side** refunds screen, where a vendor sees refunds on parcels they sold.
The endpoint supports it now (`as=seller`, the default for a vendor), but no screen exists. See
FE-34.

---

### ~~FE-19~~ · No vendor store-review screen
**✅ FIXED 2026-09-24 · vendor** (frontend only, with no backend change)

**Was:** there was no `/vendor/reviews` and no Reviews entry in `vendorDashboardLinks`. The audit
said to build it on `useMyStoreReviewsQuery`, and that **would have been wrong.** The hook hits
`GET /vendor-reviews/my-reviews`, which is `where: { userId }`: the store reviews the user
**wrote as a buyer**. A seller screen on it would have listed their reviews of *other* stores.

**Now:**

- **`/vendor/reviews`** (`features/vendors/components/vendor-store-reviews.tsx`) reads the
  **public** `GET /vendor-reviews/store/:slug` via `useStoreReviewsQuery`, with the slug from
  `useMyStoreQuery` (`/vendors/me`). That is the list shoppers see on the storefront, which is the
  point: it shows the buyer, a 1–5 star rating, the comment ("Rating only" if there is none) and the
  date.
  - It is a `DataTable` with search over the comment (the only field the backend searches),
    pagination and the FE-06 error state.
- **A summary strip** shows the store's `averageRating` and `totalReviews`, with a link to the
  public storefront.
- **No store** (a 404; an ADMIN can reach `/vendor/*`) and **an unusable store** (an actionable
  403) render the backend's message, not a failure with a retry.
- **Sidebar:** "Reviews" in `vendorDashboardLinks`.
- **The misleading hook was renamed** `myStoreReviews` → **`myWrittenStoreReviews`**
  (`useMyWrittenStoreReviewsQuery`), with a comment saying what it returns. It had no callers.

**Verified live (read-only)** as vendor1 and vendor2:

- `/vendors/me` and the store's review list return 200, and a no-match search returns 0.
- `/my-reviews` confirmed to return reviews the user wrote.
- A customer's `/vendors/me` is a 404, which is how the no-store case above was found.

**Found in the data, not fixed:** vendor1's store (Urban Threads) carries `averageRating: 5,
totalReviews: 1`, but has **zero `VendorReview` rows**, not even soft-deleted ones. So the
storefront and this screen's summary both show "5.0 · 1 review" over an empty list. The cause is
backend **BE-47**: `VendorReview.vendorOrder` is `onDelete: Cascade`, so hard-deleting an order
silently deletes its reviews without calling `recomputeVendorRating`. To repair the dev data, set
that vendor's `averageRating = null, totalReviews = 0`.

---

### ~~FE-20~~ · Two wishlist pages, one an empty shell
**✅ FIXED 2026-09-24 · storefront**

**Was:** `/dashboard/wishlist` is the real wishlist. `src/app/(root)/wish-list/page.tsx` rendered
a "wish list" heading over an empty grid, whatever the shopper had saved. Nothing in `src/` linked
to it, so it was reachable only by old links or bookmarks. The footer's Wishlist link pointed at
a third URL, `/dashboard-wishlist`, a typo that 404s (FE-10).

**Now:**

- **`(root)/wish-list` is deleted.** `next.config.ts` `redirects()` sends `/wish-list` **308 →
  `/dashboard/wishlist`**. A signed-out visitor continues through the middleware to
  `/login?callbackUrl=/dashboard/wishlist`, so they land on their wishlist after signing in.
- **Why a config redirect and not `permanentRedirect()` in a page:** it is a real HTTP 308,
  answered before any rendering, and it needs no page file.
- **The footer typo is fixed**: `footer.ts` now links `/dashboard/wishlist`. That closes the
  one-character part of FE-10.

**Verified** against `pnpm start`:

- `/wish-list` returns 308 with `location: /dashboard/wishlist`.
- Followed while signed out, the chain ends at `/login?callbackUrl=%2Fdashboard%2Fwishlist`.
- `/dashboard-wishlist` is still a 404, as expected, since nothing links there now.

The footer link itself could not be checked from served HTML, because `PersistGate
loading={null}` means no page prerenders its body. The constant was checked instead.

---

### ~~FE-21~~ · Product reviews are not gated on purchase
**✅ FIXED 2026-09-24 · reviews** (backend half: **BE-48**, branch `BE-review-purchase-gate`)

**Was:** `review-section.tsx` showed `WriteReview` to anyone signed in. The backend's create
checked only that the product was public, so **any account could review any product, any number
of times**. Store reviews were already tied to a delivered parcel, so products were the
inconsistent path.

**Backend first (BE-48):**

- A product review needs a **DELIVERED** parcel containing the product, bought by this user.
- There is **one active review per user per product**. Buying again does not earn a second one.
- `GET /reviews/eligibility/:productId` returns `{ canReview, reason, reviewId? }`, using the same
  function the create route enforces.

**Here:**

- `useReviewEligibilityQuery` (it provides `reviews`, so posting a review refetches it).
- `review-section.tsx` shows the form only when `canReview`. Otherwise `ReviewGate` explains why,
  with a next step:

  | `reason` | Shown |
  | --- | --- |
  | `ALREADY_REVIEWED` | "You have reviewed this product", with a link to edit it in My Reviews |
  | `NOT_DELIVERED` | "Your order is on its way", with a link to My Orders |
  | `NOT_PURCHASED` | "Reviews are from verified buyers" |

  If the eligibility request itself fails, the column stays empty rather than showing an error
  box. Reviewing is optional, and the backend refuses an ineligible review anyway. Signed-out
  visitors still get the login prompt.
- XR-04 is fixed on both sides in the same pass (see below). The FE-27 catch in `write-review.tsx`
  is fixed too, so lint is at **49**.

**Verified live.** One temporary order went PENDING → PROCESSING → SHIPPED → DELIVERED, and 15 of
15 checks passed:

- The response moved NOT_PURCHASED → NOT_DELIVERED (pending and shipped) → canReview.
- Creating before delivery is a 403.
- A rating-only review is a 201, and a second review is a 409.
- Eligibility then reports ALREADY_REVIEWED with the review id.
- vendor2, who never bought the product, gets a 403, and a missing token gets a 401.
- Deleting the review restores the product's rating.

The order, review and address were deleted afterwards, and stock and rating were confirmed at
their starting values. The product page was not clicked through in a browser.

**Not addressed:** reviews written **before** this gate are kept. Some may be from accounts that
never bought the product, and nothing marks them as unverified. A "Verified buyer" badge would
need a flag or a lookup per review.

---

## P2 — cleanup, and features never started

### ~~FE-22~~ · Customer `/dashboard` is a link grid, not a dashboard
**✅ FIXED 2026-09-24 · dashboard** (backend half: **BE-49**, branch `BE-buyer-summary`)

**Was:** `(dashboard)/dashboard/page.tsx` mapped over `customerDashboardLinks` and rendered one card
per sidebar entry, a second copy of the navigation. It showed no numbers at all.

**Needed from the backend:** lifetime spend has no endpoint, and computing it here would mean paging
every order down. **`GET /orders/my-summary`** (BE-49) aggregates it server-side.

**Now:** `features/orders/components/buyer-dashboard.tsx` shows:

- **A greeting** with the shopper's first name.
- **Four tiles** (`useMyOrderSummaryQuery`):
  - Orders, linking to My Orders.
  - **Total spent**: completed payments minus money actually refunded.
  - **On the way**: parcels pending, processing or shipped, with the delivered count as a hint.
  - **Refunds owed**: amount and count, styled as a warning when any are open, linking to My
    Refunds (FE-18).
- **Up to three "next steps"**, each shown only when it is true:
  - Unreviewed delivered products first, **each linking to its product page**, where a product
    review is written (FE-21).
  - Wishlist items saved.
  - "Start shopping", if the buyer has never ordered.
- **Recent orders**: the last three, with order number, date, parcel count, rollup status and
  total.
- Loading skeletons, the FE-06 error state on each query, and empty states.

`myOrderSummary` provides `orders`, `refunds` and `reviews`, so cancelling a parcel, a refund
landing or posting a review all refresh the tiles.

**A VENDOR landing on `/dashboard` sees their purchases, not their sales.** The endpoint is scoped
to the caller as a buyer, and `/vendor` is the seller dashboard.

**Verified live** with two temporary cash-on-delivery orders, one delivered and one pending. 8 of
8 checks passed:

- Orders, on-the-way and delivered each move by the right amount.
- **Spend counts only the paid order**: +152.45, exactly A's total, and nothing for the pending B.
- The delivered product appears under awaiting-review with its slug.
- The *seller* vendor1's own summary stays at 0.
- Cancelling B moves it from on-the-way to cancelled.
- There is a 401 without a token.

Both orders and their addresses were deleted afterwards, and stock was confirmed at its starting
values. The page was not clicked through in a browser.

---

### FE-23 · Eighteen defined-but-never-called endpoints
**P2 · M · api**

Each is a screen that was planned and not built. Beyond FE-14, FE-18 and FE-19:

| Hook | Defined at | Missing screen |
| --- | --- | --- |
| `useRecordManualRefundMutation` | `refunds/api/refund.api.ts:82` | manual (cash) refund entry |
| ~~`useDeleteUserMutation`~~ | — | **wired in FE-16**, renamed `useDisableUserMutation` |
| `useDeleteVendorMutation` | `vendors/api/vendor.api.ts:172` | vendor delete |
| `useVendorByIdForAdminQuery` | `vendor.api.ts:110` | admin vendor detail |
| `usePayoutByIdQuery` | `payouts/api/payout.api.ts:40` | payout detail |
| `useVendorOrderByIdQuery` | `vendors/api/vendor-order.api.ts:32` | vendor order detail |
| `useProductByIdQuery` | `products/api/product.api.ts:50` | unused — the admin detail page correctly uses the vendor endpoint instead, since `/products/:id` 404s on a draft |
| `useAllAddressQuery`, `useAddressByIdQuery` | `addresses/api/address.api.ts:25,42` | admin address list; carries the repo's only `TODO` at `:24` |
| `useLoginUserMutation`, `useOAuthLoginMutation` | `auth/api/auth.api.ts:26,38` | dead duplicates — login really goes through NextAuth. `useOAuthLoginMutation` points at a nonexistent route (XR-02) |

**Fix:** For each, either build the screen or delete the endpoint. Leaving them is how
`useOAuthLoginMutation` came to carry a wrong URL nobody noticed.

---

### FE-24 · Two RTK tags are never provided; one is misdeclared
**P2 · S · api**

`base-api.ts:56-76` declares 18 tag types.
- `"auth"` (:57) is invalidated four times (`auth.api.ts:24,35,43,51`) and **provided zero times**.
- `"payments"` (:62) is invalidated four times by refund mutations (`refund.api.ts:70,78,91,103`)
  and **provided zero times** — there is no `payment.api.ts`, and the backend has no payments read
  endpoint (**BE-28**).
- ~~`slide.api.ts` `slideById` declared `providesTags: ["products"]` where it meant `["slides"]`~~
  — **fixed in FE-14**.

All invalidation is coarse whole-tag; no `{ type, id }` is used anywhere, so any mutation drops
the entire list cache for that resource. Acceptable at this scale, worth knowing.

---

### FE-25 · Two orphaned component files
**P2 · S · cleanup**

`shared/components/td-drawer.tsx`. (`features/users/components/user-management-table.tsx` was
the other one; FE-08 mounted it.)

The other nine are **resolved**. FE-01 rewrote `products/components/filters/price-filter.tsx` and
deleted `brand`, `category` and `size` — each hardcoded a list the server now serves as a facet.
FE-03 deleted all five `features/home/components/*` orphans: four were empty shells or mock data,
and the fifth (`new-arrivals.tsx`) was replaced by an RTK Query rail.

---

### FE-26 · Five stray `console.log`s
**P2 · S · cleanup**

~~`forgot-password-form.tsx:24`~~ (removed by FE-04),
`brands/components/edit-brand.tsx:44` (harmless leftover after a working mutation),
`products/components/product-details/related-products.tsx:21`,
`home/components/new-arrivals.tsx:17` (swallows a fetch error),
`shared/lib/delete-temp-image.ts:13` (swallows the error).

The four `console.error`s in `auth-options.ts` and `TDImageUpload.tsx` are legitimate.

---

### FE-27 · Thirty-nine `any`s, eight of them in type definitions
**P2 · M · types**

`pnpm lint` passes at **49 warnings / 0 errors** (52 before FE-04, 51 before FE-08, 50 before FE-21); treat that as the baseline and do not add to it.

- **26 are `catch (error: any)`** followed by `error?.data?.message`, with no shared helper.
  ~~`reviews/components/review-section/write-review.tsx:36` uses `error.data.message` **without**
  optional chaining, so a network failure throws inside the catch block.~~ Fixed in FE-21.
- **8 are `any` in type definitions**, which defeats the point of the type layer:
  `orders/types/order.types.ts:51-57` (`transactionId`, `paymentGateway`, `gatewayResponse`,
  `failureReason`, `paidAt`, `refundedAt`, `refundAmount`) and `auth/types/auth.types.ts:5`
  (`phone: any`).
- 4 are `as any` around `form.setValue` in `shared/form/TDImageUpload.tsx:57,58,139,140`.

**Fix:** The helper now exists — `getApiErrorMessage(error)` in `shared/utils/api-error.ts` (FE-06). Replace all 26 catches with it — that alone
clears roughly half the lint baseline. Then type the eight definition fields from the Prisma
schema.

---

### FE-28 · Duplicate type definitions across features
**P2 · S · types**

`VendorStatus`, `PayoutStatus` and `RefundStatus` each exist twice — once in
`features/orders/types/status.types.ts` and once in the owning feature's types file. Values agree
today. `PaymentStatus` exists twice and the two **disagree** — see **XR-09**, which is the reason
this matters.

**Fix:** Keep `status.types.ts` as the single source and re-export from it.

---

### FE-29 · No `.env.example`; README is scaffold boilerplate
**P2 · S · onboarding**

There is no `.env.example` — only a gitignored `.env.local`. A fresh clone cannot be configured
without reading `CLAUDE.md`. The six required variables are `NEXT_PUBLIC_BACKEND_URL`,
`NEXT_PUBLIC_TAX_RATE`, `NEXT_PUBLIC_SHIPPING_COST`, `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD`,
`NEXT_AUTH_SECRET`, `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, plus the two Cloudinary keys read
directly from `process.env`.

`README.md` is still the untouched `create-next-app` output, and `package.json` is still
`"name": "client"`.

**Also verify `.env.local` is gitignored** — it is present on disk with a real
`NEXT_AUTH_SECRET` and `GOOGLE_CLIENT_SECRET`.

---

### FE-30 · No env validation — a missing tax rate silently means 0%
**P2 · S · config**

`src/shared/config/env-config.ts` exposes every value as `string | undefined`, and
`calculate-order-total.ts:26` does `Number(envConfig.tax_rate) || 0`.

A deploy that omits `NEXT_PUBLIC_TAX_RATE` shows **0% tax in the cart** while the backend charges
its own rate — the buyer is billed more than quoted, with no error anywhere. See **XR-01**.

**Fix:** Parse the public env through a Zod schema at module load and throw on a missing required
value.

---

### FE-31 · Thirteen raw `<img>` tags bypass `next/image`
**P2 · S · performance**

Including `(root)/products/[slug]/page.tsx:62`, `store-front.tsx:56,68`,
`store-directory.tsx:70,83`, `checkout-form.tsx:146` and six table column files. Five carry an
`eslint-disable-next-line @next/next/no-img-element`.

No lazy loading, no responsive `srcset`, no format negotiation — on the storefront pages where
images dominate the payload.

---

### FE-32 · Accessibility
**P2 · L · a11y**

Three `aria-*` attributes in all of `src/features`, `src/app` and `src/layouts` combined.
Icon-only buttons with no accessible name (the worst example, `admin/user/page.tsx`, was deleted in FE-08). Search inputs with no
`<label>` and no `<form>`. `lang="en"` hardcoded at `src/app/layout.tsx:31`. No skip link, no
focus management on the `TDSheet`/`TDModal` overlays.

---

### FE-33 · No test runner, no CI
**P2 · L · ops**

No jest/vitest/playwright/cypress, no `*.test.*` or `*.spec.*`, no `.github/`. Scripts are only
`dev`, `build`, `start`, `lint`.

The highest-value first target is `calculate-order-total.ts` — it is a pure function, it handles
money, and it has already diverged from its backend twin once (**XR-07**).

---

### FE-34 · Vendor dashboard gaps
**P2 · M · vendor**

FE-19 added store reviews. Still missing: no vendor analytics or time series (`orderAnalytics` is admin-only); no vendor order
detail page (`useVendorOrderByIdQuery` unused — the table is the only view); no payout detail; no
Profile entry in `vendorDashboardLinks`, unlike admin and customer; no rejection-reason surface, so
a seller sees a REJECTED badge without the reason; no view of refunds against parcels they sold (`GET /refunds/me?as=seller` is ready — BE-46); no
low-stock alerts, bulk import/export or promotion tooling.

What does exist is solid: `/vendor` handles both `isLoading` and `isError`, and products, orders,
payouts, settings and apply are all real.

---

### FE-35 · Admin dashboard gaps
**P2 · M · admin**

Beyond FE-08, FE-11, FE-14 and FE-16: no settings screen of any kind (commission rate, tax rate,
shipping defaults, platform config — all DB-only); no admin vendor detail page; no manual-refund
entry; no coupons; no email/notification management; no audit log; no date-range picker on
analytics.

---

### FE-36 → FE-38 · Storefront capabilities not started
**P2 · L · storefront**

| ID | Missing | Note |
| --- | --- | --- |
| FE-36 | Coupon field at checkout | zero occurrences of coupon/promo in `src/`; backend has no `Coupon` model (**BE-29**) |
| FE-36 | Guest checkout | `checkout-form.tsx:53-64` accepts an inline address, but `base-api.ts:17-23` attaches a session token to every call — effectively logged-in only |
| FE-36 | Multi-currency | `currencyFormatter` hardcodes `en-US`/`USD` (`calculate-order-total.ts:103-108`) |
| FE-36 | i18n | no `next-intl`, no `[locale]` segment, `lang="en"` fixed |
| FE-37 | Category browsing | `/categories/[slug]` now redirects into the filtered catalogue (FE-07), but there is no `/categories` index |
| FE-37 | Brand browsing | no route at all, though `/brands` exists on the backend |
| FE-37 | Compare, recently viewed | nothing |
| FE-38 | Order tracking timeline | the tracking *number* renders (`my-orders-list.tsx:124`, `order-details.tsx:286`) but there is no carrier link, no status timeline and no public track-by-number page. The backend has the data in `OrderStatusHistory` and never exposes it (**BE-13**) |
| FE-38 | Per-order invoice | the PDF export (`orders/components/my-orders/pdf-download-print.tsx`) is a bulk "my-orders.pdf" list, not a per-order invoice |
| FE-38 | Newsletter | `layouts/footer.tsx:74-77` has the heading and input, no submit and no API |

---

### FE-39 · Committed build artefacts; no Prettier config
**P2 · S · cleanup**

`tsconfig.tsbuildinfo` (313 KB) and `.DS_Store` are present in the repo root. Indentation is
inconsistent (tabs in `product-wrapper.tsx`, `recent-orders-table.tsx`, `brand-list/page.tsx`;
four spaces elsewhere) with no Prettier config to settle it.

---

## Cross-repo contract

_Mirrored in `docs/FEATURE-GAPS.md` of the backend repo. The two repos share only HTTP, so a
change here is always two commits on two branches._

### XR-01 · Tax defaults disagree across four files
**P1 · S · config**

| Source | `TAX_RATE` |
| --- | --- |
| `backend/src/config/env-config.ts:32` (code fallback) | **0.08** |
| `backend/.env.example:40` and the live `backend/.env` | **0.05** |
| `frontend/.env.local` (`NEXT_PUBLIC_TAX_RATE`) | **0.05** |
| `src/features/cart/utils/calculate-order-total.ts:26` (code fallback) | **0** |

The running pair agrees at 0.05, so checkout is correct today. But a deploy that forgets the
variable shows **0% tax in the cart while the backend charges 8%** — the buyer is billed more than
they were quoted, and silently, because the backend recomputes from DB prices and never trusts the
client.

`SHIPPING_COST` (100) and `FREE_SHIPPING_THRESHOLD` (1000) agree across all four places.

**Fix:** See FE-30 — make the tax rate required rather than defaulted, on both sides.

---

### XR-02 · Endpoints that exist on one side only
**P2 · S · contract**

**Calls here that would 404** — both currently unmounted, so latent rather than live:
- `GET /auth/google` (`src/features/auth/api/auth.api.ts:38-43`) — wrong path *and* wrong verb.
  The real endpoint is `POST /auth/oauth-login`, which `auth-options.ts:127` calls correctly.
- ~~`DELETE /users/:id`~~ — **exists and is wired** (BE-34; FE-16), with `PATCH /:id/restore` and `/:id/role`.

**Backend routes nothing here calls:** `GET /products/:productId/variants` and `/images` (both arrive nested on the product);
`GET /wishlists/:id`; `PATCH`/`DELETE /vendor-reviews/:id`; `GET /vendor-reviews/my-reviews`
(reviews the user *wrote*, hook `useMyWrittenStoreReviewsQuery`, no screen); `GET /address` admin list; `GET /payouts/:id`;
`GET /refunds/:id` (FE-18). See FE-23.

---

### XR-03 · Brand `logo` never reaches the database
**P1 · S · contract — ✅ backend half FIXED 2026-09-22; frontend half still open**

**Was:** the backend's `brandSchema` declared **only `name`** and its `validateRequest` stripped
the `logo` this form sends, so the request returned 200 with the logo gone.

**Backend now:** `brandSchema` and a new `brandUpdateSchema` both declare `logo` as a validated URL
string, and the empty string this form sends is stored as `null` rather than rejected or persisted
as `""`. See `backend/docs/FEATURE-GAPS.md` BE-21. **The original "backend only, nothing to change
here" verdict was wrong.**

**Still open here:** `brand-form.tsx` carries `logo` in its zod schema and default values but
**renders no input for it** — only a `name` field and the submit button. So the value posted is
always `""`, and an admin has no way to set a brand logo even though the API now accepts one.
`edit-brand.tsx` still has its logo default commented out.

**Fix here:** give `BrandForm` an image upload control. `Brand.logo` is a **plain URL string**, not
the `{ url, publicId }` pair that vendor/product images use — send the Cloudinary secure URL only.

---

### ~~XR-04~~ · A rating-only review always 400s
**✅ FIXED 2026-09-24 on both sides · contract** (with FE-21 / BE-48)

**Was:** the form initialised `comment: ""` and submitted it verbatim. The backend's
`comment: z.string().min(5)…optional()` treats an empty string as *present*, so `.optional()` did
not apply and every rating-only review got a 400 reading "Min length is 2", which did not even
match the rule. The frontend's catch read `error.data.message` without optional chaining, so a
network failure threw inside the catch.

**Now, both halves:**

- **Backend:** `review.validation.ts` has one shared `optionalComment`, used by create *and*
  update. It preprocesses a blank string to `undefined`, and the rule is 2–400 characters with
  messages that say so.
- **Frontend:** `write-review.tsx` drops an empty comment before sending, reports errors through
  `getApiErrorMessage`, and resets the form on success. `review-form.schema.ts` checks the same
  2–400 rule client-side.

Verified live: a rating-only review with `comment: ""` returns 201 with `comment` stored as `null`,
and a one-character comment is a 400 with "A comment should be at least 2 characters".

**Side effect on edit:** a blank comment in `PATCH /reviews/:id` now means "leave it unchanged". A
comment cannot be removed by clearing it. It needs an explicit `null` if that is ever wanted.

---

### XR-05 · Types here that the backend does not actually send
**P1 · M · contract**

Most of these are **our** type declarations being wrong, not the backend being wrong:

| Type here | Reality |
| --- | --- |
| `TProductVariant.size` required (`products/types/product.types.ts:23-26`) | the backend includes the `size` relation only on `findBySlug` and the vendor read — **not** on `GET /products` or `GET /products/:id`. `variant.size.name` throws on those |
| `TProductImage.productId`, `.publicId`, `.isDeleted` required (`:30-38`) | list reads select only `{id, url, isMain}` |
| `TOrder.user.email` flat (`orders/types/order.types.ts:97-102`) | the backend nests it as `user.auth.email` — always `undefined` here |
| `TOrder.user` required | `GET /orders/my-orders` does not include `user` at all |
| `TOrderPaymentResponse` nine fields (`:45-60`) | `my-orders` selects five; only `getOrderById` returns the full row |
| Order money fields required `string` (`:73-77`) | deliberately `undefined` for a VENDOR viewing an order — the vendor sees only their own slice |
| `TReview.rating: number` (`reviews/types/review.types.ts:6`) | Prisma `Decimal` → JSON **string**. `edit-review.tsx:26` feeds it to a `z.number()` resolver, so the edit form's rating is invalid on load. Every other decimal here is correctly typed `string`, including `TVendorReview.rating` |
| `TVendor._count.payouts` (`vendor.types.ts:83`) | never selected |
| ~~`TSlide` has no `sortOrder`/`isActive`~~ | **fixed in FE-14**, along with `photoPublicId` |
| `ShippingSnapshot.state` required, no `email` (`order.types.ts:5-19`) | `Address.state` is nullable and `email` is required. `TAddress.state?` gets this right — the two are internally inconsistent |

**~~Two are~~ One is genuinely backend-side:** the missing `size` include.

~~`GET /users` returning no email, role or `meta`~~ — **fixed backend-side 2026-09-22 (BE-15 +
BE-20)**. `meta` is returned, and `email` and `role` now arrive **flat**, exactly as `TUser`
already declares them. The backend chose flattening over nesting under `auth` specifically so this
side would not have to change: `TUser` was right and the API was wrong. `row.email` and `row.role`
in `user-management-columns.tsx` render real values now, and `DataTable` gets its pagination.

Two caveats, both handled by **FE-08**:
- **The search box now honours its own placeholder.** *"Search by name, email…"* previously
  searched name and phone only; `?search=` now also matches email, case-insensitively.
- **`email` and `role` may be `null`** on a user with no `Auth` row (an account that cannot sign
  in at all). `TUser` now types both as `string | null`.

---

### XR-06 · Form bounds that disagree with the backend
**P2 · S · contract**

- **Variant stock:** `product-form.schema.ts:21-23` uses `.positive()`, which forbids `0`; the
  backend allows `min(0)`. **A vendor cannot mark a variant out of stock from the UI.** *(Fix
  here.)*
- **Size group:** `sizes/schemas/size-form.schema.ts:12-15` marks `sizeGroupId` optional; the
  backend requires it — a 400 the form cannot prevent. *(Fix here.)*
- **Product gender** is typed `z.string()` (`product-form.schema.ts:79-81`) rather than an enum,
  and its options live in a file named `shared/constants/mock-products.ts`. A bad value only fails
  at the backend with a 400. *(Fix here.)*
- **Vendor `payoutDetails`:** the backend's apply schema accepts it; `vendorApplySchema`
  (`vendor-form.schema.ts:20-40`) never sends it, so a seller cannot supply bank details at
  application time. *(Either side.)*
- ~~**Profile name:** the backend's unused `userUpdateSchema` requires `min(5)`; this form requires
  `min(1)`.~~ **Settled 2026-09-22:** the backend relaxed to `min(1)` and now applies the schema.
  This form already matches — **no change needed here.**

---

### XR-07 · Free shipping diverges when the threshold is `0`
**P1 · S · money**

`calculate-order-total.ts:61-62` requires `freeShippingThreshold > 0 && subtotal >= threshold`.
The backend (`helpers/order.ts:238-241`) requires only `subtotal >= threshold`, which at `0` is
always true.

So a store with `freeShippingThreshold = 0` — which `vendor-form.schema.ts:11` explicitly permits
via `.min(0)` — gets **free shipping from the backend and a full shipping fee in this cart.** The
buyer is over-quoted and charged less than displayed. Harmless in direction, but `CLAUDE.md`
promises the two agree to the cent, and they do not.

**Fix:** The backend is authoritative. Drop the `> 0` guard here so `0` means "free shipping
always" on both sides.

---

### XR-08 · Query-param conventions agree; two sharp edges remain
**P2 · S · query**

`buildQueryParams` defaults (`page:1, limit:10, search:"", sortBy:"createdAt:desc"`) match
`PrismaQueryBuilder`'s reserved names and defaults exactly. **No list screen currently sends a
param that would become a bogus `where` clause.** Two caveats:

- `useTableFilters` defaults `limit` to `"20"` (`use-table-filters.ts:23`) while
  `buildQueryParams` strips `"10"` as the default. Choosing "10" drops the param and the backend
  falls back to 10 — the right answer by coincidence. If either default moves independently, the
  limit selector starts lying.
- ~~⚠️ **LIVE BUG as of 2026-09-22**~~ — **resolved backend-side the same day, no change needed
  here.** `shared/constants/sort-options.ts:16-23` (`userSortOptions`) offers
  `email:asc`/`email:desc`, and `email` lives on the backend's `Auth` model, not `User` — so for a
  few hours, between BE-14/BE-15 and BE-20, picking **Email** in the admin user table returned
  `400 Cannot sort by "email"`. BE-20 taught the backend's query builder about declared relation
  aliases instead of asking this side to drop the option, so **keep both Email entries**; they
  work. Sorting by `role` would also work if it were ever offered — note it orders by the enum's
  database declaration order (`CUSTOMER < ADMIN < VENDOR`), which is not alphabetical.

---

### XR-09 · Enum drift
**P2 · S · contract**

The backend's Prisma enums and its Zod mirrors agree on all nine mirrored enums. The drift is on
this side:

- **`PaymentStatus` exists twice here and the copies disagree.**
  `features/orders/utils/payment-status.ts:3-8` is **missing `PARTIALLY_REFUNDED`**, and
  `PAYMENT_STATUS_STYLES` (`:10-15`) is keyed on that union — so a partially-refunded order falls
  through the `??` at `:19` and renders with **Pending** styling. The other copy
  (`orders/types/status.types.ts:8-14` + `constants/status-maps.ts:17-42`) is correct. Since
  `PARTIALLY_REFUNDED` exists precisely so that refunding one parcel of three is not misreported,
  rendering it as *Pending* defeats the point.
- **Three phantom types** describe backend concepts that do not exist:
  `TUserStatus = ACTIVE | INACTIVE` (`status.types.ts:16-18`; the backend `User` has only
  `isDeleted`), `TCouponStatus` (`:46-49`; there is no `Coupon` model), and a pre-marketplace
  `TProductStatus = ACTIVE | INACTIVE | OUT_OF_STOCK` (`:20-23`) sitting beside the correct
  `TProductModerationStatus`.
- `EnumUserRole.SUPER_ADMIN` exists only here — deliberate; see "Verified NOT a gap".

**Fix:** Delete `payment-status.ts` and use `status-maps.ts` everywhere (FE-28). Delete the three
phantom types.

---

### XR-10 · CORS is hardcoded; this repo has no `.env.example`
**P1 · S · config**

The backend pins `origin: ["http://localhost:3000"]` in source (`app.ts:18`) while `FRONTEND_URL`
sits in its env unused — so **this app cannot be deployed to any other origin** without a backend
source edit.

Symmetrically, this repo has no `.env.example` (FE-29), so its six required variables are
documented only in `CLAUDE.md`.

---

### XR-11 · Password reset — ✅ both sides done 2026-09-24
**P1 · M · auth**

**Updated 2026-09-22.** The backend half has landed; **this side is now the only thing missing.**

| Piece | State |
| --- | --- |
| `POST /auth/forgot-password` | ✅ emails a single-use link, generic 200, token never in the body |
| `POST /auth/reset-password` | ✅ redeems the token and sets the new password |
| Email delivery + token storage | ✅ SHA-256 hashed, TTL, single-use, supersede, per-account cooldown |
| Forgot-password form here | ✅ wired (FE-04) |
| `/reset-password` page here | ✅ built (FE-04) |

**What to build, and the contract it must meet:**

```
POST /auth/forgot-password   { email }
  -> 200 { success: true, message: "If an account exists…", result: null }   ALWAYS
     Render that message verbatim. Do NOT branch on whether the account exists,
     and do not show "email not found" — the endpoint is deliberately identical
     for every input so it cannot be used to discover who has an account.

POST /auth/reset-password    { token, newPassword }
  -> 200 { success: true, message: "Password has been reset successfully…", result: null }
  -> 400 "This password reset link is invalid or has expired. Please request a new one."
     Covers unknown, expired, already-used and malformed tokens, deliberately
     indistinguishable. Surface it as-is and link back to /forgot-password.
```

Concretely:

1. Point `forgot-password-form.tsx:24` at a new `forgotPassword` mutation in
   `features/auth/api/auth.api.ts`, and render the returned message. On success, swap the form for
   a "check your inbox" state rather than redirecting.
2. Add `src/app/(auth)/reset-password/page.tsx`. The emailed link is
   **`${FRONTEND_URL}/reset-password?token=<raw>`**, so this exact path must exist and read
   `?token=` from the search params.
3. Add `reset-password.schema.ts` mirroring the backend's shared `passwordRule`: 6–30 characters,
   at least one letter and one number, plus a confirm-password field that is validated here only.
4. Whitelist `/reset-password` in `auth-sync.tsx` alongside `/forgot-password`, or a logged-in user
   following the link gets bounced to their role home.
5. On success, send the user to `/login` with a toast — do **not** auto-login; the backend returns
   no tokens from this endpoint, by design.

**Note:** a social-only (Google) account is skipped silently by the backend — it has no password to
reset, so the generic "link sent" comes back and no mail arrives. Worth a line of copy on the
confirmation screen pointing Google users at the Google button.

---

## Verified NOT a gap

Things that look wrong at a glance and are deliberate. Please do not re-raise these without
reading the reasoning.

- **`EnumUserRole.SUPER_ADMIN` has no backend counterpart.** No JWT will ever carry it; it is kept
  because existing admin checks reference it and treating it as an admin costs nothing. Documented
  in `features/auth/constants/user-role.ts:1-9`. Do not add new behaviour depending on it.
- **`/vendor/apply` is reachable by a CUSTOMER.** That is how a shopper becomes a seller —
  `src/middleware.ts` exempts it on purpose.
- **Checkout math is duplicated from the backend.** The copy here is display-only; the backend
  recomputes from DB prices and never trusts client-supplied amounts.
- **`/products` and `/products/:id` 404 on a draft.** Correct — they apply the public visibility
  filter. Admin and vendor screens must use `useMyVendorProductByIdQuery`,
  `useMyVendorProductsQuery` or `useAllProductsForAdminQuery`. `admin/product-list/[id]` already
  does the right thing, which is why `useProductByIdQuery` is unused (FE-23).
- **The dashboard sidebar is flat and `children` are tabs, not sub-rows.** Never add a page-level
  tab strip by hand — add a child in `dashboard-navlink.ts` and `DashboardTabs` renders it.
- **An empty toolbar filter value is dropped from `queryParams`.** Deliberate: the backend turns
  any unknown key into a `where` clause, so `status: ""` would match nothing rather than meaning
  "all".
- **`ahooks` / `@ahooks.js/use-url-state` are installed but unused.** URL state is hand-rolled in
  `useTableFilters`. Do not introduce a second mechanism.
- **Features have no barrel `index.ts`.** One per feature would make the `products` ↔ `wishlist`
  pair a real circular dependency and pull every component of a feature into any route touching
  it.
- **`pnpm build` must run as the script** (`next build --turbopack`). A bare `next build` uses
  webpack and fails on `@react-pdf/renderer`'s ESM-only package.
- **Editing a product must round-trip variant and image `id`s.** The backend deletes whatever ids
  it does not receive — including the Cloudinary assets.
- **`deleteTempImage` fires only when the `publicId` contains `/temp/`.** That guard is what keeps
  a live product image from being destroyed. Preserve it.

---

## Corrections made to existing docs during this audit

- The root `CLAUDE.md` lists `RecentOrdersTable` and `NewComments` among the mock admin widgets.
  **Stale** — both use real RTK Query hooks now (`recent-orders-table.tsx:8`,
  `new-comments.tsx:8`), as does `MarketplaceOverview`. Only `OrderChart`, `TopProducts` and
  `ProductsOverview` are fixtures (FE-11).
- The root `CLAUDE.md` documents the backend on port `5000`; the backend's `.env`, `.env.example`
  and `pnpm stripe:listen` all use `5001`.
- The root `CLAUDE.md` gives the backend `TAX_RATE` default as `0.08`; that is a code fallback
  which disagrees with `.env.example` (XR-01).
