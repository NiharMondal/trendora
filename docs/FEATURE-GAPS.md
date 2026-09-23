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
| FE-03 | The home page renders only the hero slider | P0 | M | storefront |
| FE-04 | Forgot-password form submits to `console.log` (backend now ready) | P0 | M | auth |
| FE-05 | No `error.tsx`, `not-found.tsx` or `loading.tsx` anywhere | P0 | M | robustness |
| FE-06 | Only one component in the app handles `isError` | P0 | M | robustness |
| FE-07 | Placeholder pages wired into live navigation | P1 | M | dashboard |
| FE-08 | `/admin/user-management` is empty; the real table is unlinked | P1 | S | admin |
| FE-09 | Hardcoded "Your Balance $12627" on every dashboard page | P1 | S | dashboard |
| FE-10 | Footer links to nine routes that do not exist | P1 | M | storefront |
| FE-11 | Three admin dashboard widgets are demo fixtures | P1 | M | analytics |
| FE-12 | SEO metadata is on the wrong pages; none on the storefront | P1 | M | seo |
| FE-13 | No `sitemap.ts`, `robots.ts` or OpenGraph | P1 | S | seo |
| FE-14 | No admin hero-slider screen despite full CRUD API | P1 | M | admin |
| FE-15 | Five search boxes are silent no-ops | P1 | S | tables |
| FE-16 | Admin user actions are inert buttons | P1 | S | admin |
| FE-17 | `next.config.ts` allows any https image host | P1 | S | security |
| FE-18 | No customer-facing refunds view | P1 | M | orders |
| FE-19 | No vendor store-review screen | P1 | M | vendor |
| FE-20 | Two wishlist pages, one of them an empty shell | P1 | S | storefront |
| FE-21 | Product reviews are not gated on purchase | P1 | M | reviews |
| FE-22 | Customer `/dashboard` is a link grid, not a dashboard | P2 | M | dashboard |
| FE-23 | 18 defined-but-never-called endpoints | P2 | M | api |
| FE-24 | Two RTK tags are never provided; one is misdeclared | P2 | S | api |
| FE-25 | 11 orphaned component files | P2 | S | cleanup |
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

- **The navbar box is NOT synced from the URL.** The navbar is mounted in the root layout, so a
  `useSearchParams` call there would opt *every route in the app* out of static rendering — to
  display a term the catalogue's own toolbar input already shows. It is a jumping-off point, not a
  second source of truth for `?search=`. (Confirmed: `/products` is still `○ Static` after this
  change.)
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

### FE-03 · The home page renders only the hero slider
**P0 · M · storefront**

**Now:** `src/app/(root)/page.tsx` renders `<HeroSlider />` and nothing else.

**Gap:** Five built home sections are orphaned files that no route imports:
`src/features/home/components/{featured-product,new-arrivals,offer,showcase,trending-product}.tsx`.
The landing page of the storefront is a carousel above empty space.

**Fix:** Compose the sections into `(root)/page.tsx`. Two caveats before doing so:
`trending-product.tsx:12` reads from `src/shared/constants/mock-products.ts` and needs a real
query first, and `new-arrivals.tsx:17` swallows its error into a `console.log`.

---

### FE-04 · The forgot-password form submits to `console.log`
**P0 · S · auth**

**Now:** `src/features/auth/components/forgot-password-form.tsx:24` is
`const onSubmit = (data) => { console.log(data); }`. The page
(`src/app/(auth)/forgot-password/page.tsx`), the zod schema
(`src/features/auth/schemas/forgot-password.schema.ts`), the link from the login form
(`login-form.tsx:90-93`) and the `auth-sync.tsx:9` whitelist all exist.

**Gap:** A user who has forgotten their password sees a complete, styled form with a "Send Reset
Link" button that does nothing at all — no request, no error, no feedback.

**Fix — unblocked as of 2026-09-22.** This was previously blocked on the backend returning a
valid access token in the response body; that is now fixed (backend **BE-01**), and
`POST /auth/forgot-password` and `POST /auth/reset-password` both behave correctly and mail a
single-use link.

So this is now purely frontend work: wire the form to a `forgotPassword` mutation, and add the
`/reset-password` page the emailed link points at. **XR-11** carries the exact request/response
contract, the five concrete steps, and the one behaviour not to get wrong — the forgot-password
response is identical for every input on purpose, so the UI must never branch on whether the
account exists.

---

### FE-05 · No `error.tsx`, `not-found.tsx`, `loading.tsx` or `global-error.tsx` anywhere
**P0 · M · robustness**

**Now:** `find src/app -name "error.tsx" -o -name "not-found.tsx" -o -name "loading.tsx" -o -name "global-error.tsx"`
returns **nothing**, across 58 `page.tsx` files.

**Gap:** Any render throw shows the raw Next.js error overlay in development and a blank screen in
production. Any bad URL — including `/faq`, `/contact-us` and the seven other dead footer links in
FE-10 — shows the stock unstyled Next 404. There are no route-level loading boundaries.

**Fix:** Add `src/app/global-error.tsx`, a branded `src/app/not-found.tsx`, and an `error.tsx` at
each route-group root (`(root)`, `(dashboard)`, `(auth)`) with a reset button. Add `loading.tsx`
where a page does server-side work.

---

### FE-06 · Only one component in the entire app handles `isError`
**P0 · M · robustness**

**Now:** The only `isError` read in the codebase is
`src/features/vendors/components/vendor-dashboard.tsx:30`.

**Gap:** Everywhere else a failed request renders as an empty list — indistinguishable from "you
have no orders". The user is told nothing went wrong, so they do not retry.

Worst case: `src/app/(dashboard)/admin/(products)/product-list/[id]/page.tsx:19` is
`if (isLoading) return;` — returning `undefined` renders nothing — and then `:27` dereferences
`product?.result?.images[selectedImage].url`, which **throws on a product with no images**. With
FE-05 unfixed, that is a blank screen.

**Fix:** Establish one error pattern and apply it to the list/detail screens. `DataTable` already
renders `NoDataFound` when empty; give it an error state too, so every table inherits the fix.
Fix the unguarded array index at `product-list/[id]/page.tsx:27` regardless.

---

## P1 — a user hits this

### FE-07 · Placeholder pages wired into live navigation
**P1 · M · dashboard**

**Now:**

| Route | Renders | Reachable? |
| --- | --- | --- |
| `/admin/hot-offers` | `<div>HotOffers</div>` | **Yes — sidebar row** (`src/layouts/dashboard/dashboard-navlink.ts:141`) |
| `/admin/order-history` | `<div>OrderHistory</div>` | Orphan — the sidebar's "Order History" points at `/admin/order-list` |
| `/categories/[slug]` | `<div>page</div>` | Yes — every category link on the storefront |
| `/about-us` | `<div>AboutUs</div>` | Yes — footer |

**Gap:** An admin clicking "Hot Offers" lands on the word "HotOffers". A shopper clicking any
category lands on the word "page". These are the most visible unfinished edges in the product.

**Fix:** Build them, or remove the nav entries and routes until they exist. `/categories/[slug]`
is the urgent one — it is on the shopper's main path and the data layer
(`useAllProductsQuery` with a `categoryId` filter) already supports it.

---

### FE-08 · `/admin/user-management` is empty; the working table is unlinked
**P1 · S · admin**

**Now:** `src/app/(dashboard)/admin/user-management/page.tsx` renders **only a `<Headline>`** — and
it is the sidebar target (`dashboard-navlink.ts:132`). The working 134-line user table lives at
`/admin/user`, which nothing links to. A third implementation,
`src/features/users/components/user-management-table.tsx`, is orphaned.

**Gap:** Admin user management appears to be broken, because the screen the nav points at is
blank. Three implementations of one screen exist and the wrong one is wired up.

**Fix:** Keep `user-management-table.tsx` (it uses the shared `DataTable`), render it from
`/admin/user-management`, and delete `/admin/user` — which hand-rolls its own table, `Select`,
`Input` and `Pagination` in defiance of the centralised table convention. That also resolves
FE-16.

---

### FE-09 · Hardcoded "Your Balance $12627" on every dashboard page
**P1 · S · dashboard**

**Now:** `src/app/(dashboard)/layout.tsx:41-44`. It is in the chrome, so it renders for **admin,
vendor and customer alike**, on every dashboard route. The same layout has a decorative "Search
anything…" input with no handler at `:29-33`.

**Gap:** A fabricated money figure shown to every logged-in user on every page, next to real
money. A seller could reasonably read it as their payout balance.

**Fix:** Remove it, or replace it with a real value per role — the vendor case has
`useMyBalanceQuery` (`src/features/payouts/api/payout.api.ts`) ready. The fake search input beside
it can be removed, or wired the way FE-02 wired the navbar — `useNavbarSearch`
(`layouts/navbar/use-navbar-search.ts`) is reusable for it.

---

### FE-10 · The footer links to nine routes that do not exist
**P1 · M · storefront**

**Now:** `src/shared/constants/footer.ts` lists `/shipping-and-return` (:3), `/contact-us` (:4),
`/not-found` (:5), `/maintenance` (:6), `/faq` (:10), `/privacy-policy` (:11), `/cookie-policy`
(:12, twice), `/terms-and-conditions` (:13) and `/dashboard-wishlist` (:19).

**Gap:** Every one is a hard 404 — shown with the stock Next error page because of FE-05. The last
is a typo for `/dashboard/wishlist`. A site with no privacy policy or terms page is also a
compliance problem before launch.

**Fix:** Fix the `/dashboard-wishlist` typo now (one character). Write the four legal/help pages
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
`products/page.tsx`, `products/[slug]`, `categories/[slug]`, `stores/[slug]`, `cart`, `about-us`.
There is no `generateMetadata` anywhere, and the storefront detail pages are `"use client"`
(`src/app/(root)/products/[slug]/page.tsx:1`), so they cannot produce per-item titles as written.
The root description is still `"Generated by create next app"` (`src/app/layout.tsx:24`).

**Gap:** Every product and store shares one generic title and the scaffold description. For a
storefront whose traffic depends on product pages ranking, this is a significant miss.

**Fix:** Add `generateMetadata` to `products/[slug]`, `categories/[slug]` and `stores/[slug]`,
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

### FE-14 · No admin hero-slider screen, despite a complete CRUD API
**P1 · M · admin**

**Now:** `src/features/home/api/slide.api.ts` defines `createSlide` (:9), `slideById` (:32),
`updateSlide` (:41) and `deleteSlide` (:55). **All four hooks are imported by nothing.** There is
no `/admin/slides` route and no sidebar entry.

**Gap:** The hero carousel — the first thing on the storefront — can only be changed through the
database. The API work is already done on both sides.

**Fix — backend is ready as of 2026-09-22.** Add `/admin/(slides)/slide-list` + `add-slide`
following the brand pattern (`src/features/brands/components/brand-table.tsx` is the canonical
wiring), and one `dashboard-navlink.ts` entry.

`isActive` and `sortOrder` now work (backend **BE-16**), and the listing the screen needs already
exists: **`GET /slides/admin/all`** (ADMIN) returns every non-deleted slide *including deactivated
ones*. Use that, not `GET /slides` — the public list hard-filters `isActive: true`, so a management
screen built on it could never show or restore a slide the operator had hidden. The frontend's
`slide.api.ts` currently only calls the public list, so this needs a new endpoint entry.

---

### FE-15 · Five search boxes are silent no-ops
**P1 · S · tables**

**Now:** The admin orders table (`order-table.tsx:13`), my-orders (`my-orders-list.tsx:31`), the
admin payout table (`payout-admin-table.tsx:32`), vendor payouts (`vendor-payouts.tsx:33`) and the
refund console (`refund-admin-console.tsx:45`) all render a search input bound to `filters.search`.
But `order.service.ts`, `payout.service.ts` and `refund.service.ts` on the backend **never call**
`PrismaQueryBuilder.search()`.

**Gap:** Typing sends `?search=…`, which the backend accepts as a reserved param and ignores. The
box looks functional, returns the unfiltered list, and reports no error.

**Fix:** Add `.search([...])` to those three backend services (a one-line change each), or remove
the `filters` prop from those five tables. The backend fix is preferable — users expect search
there.

---

### FE-16 · Admin user actions are inert buttons
**P1 · S · admin**

**Now:** `src/app/(dashboard)/admin/user/page.tsx:105-112` renders Eye and Block buttons with
**no `onClick`**. Every row hardcodes the location `"Dhaka, Bangladesh"` at `:97`.
`useDeleteUserMutation` exists (`src/features/users/api/user.api.ts:48`) and is used nowhere — and
would 404 anyway, since the backend has no `DELETE /users/:id` (**XR-02**).

**Gap:** An admin sees View and Block controls that do nothing, beside a fabricated address on
every row.

**Fix:** Resolved largely by FE-08. The backend needs a user-management surface first
(**BE-34**) — there is currently no ban, no role change and no delete endpoint, so there is
nothing to wire these buttons to.

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

### FE-18 · No customer-facing refunds view
**P1 · M · orders**

**Now:** `useMyRefundsQuery` (`src/features/refunds/api/refund.api.ts:21`) and
`useRefundByIdQuery` (`:57`) are defined and used nowhere. `features/refunds` has exactly one
component, and it is the admin console.

**Gap:** A buyer whose order was cancelled has no screen showing whether their money came back.
`my-orders-list.tsx` does render `slice.refund.status` inline — which is the important half — but
there is no list, no history and no detail.

**Fix:** Add `/dashboard/my-refunds` backed by `useMyRefundsQuery`, plus a sidebar entry in
`customerDashboardLinks`. Keep the existing rule visible: a `CANCELED` parcel whose refund is
`FAILED` is a buyer who has **not** been paid — never present cancellation as settled.

---

### FE-19 · No vendor store-review screen
**P1 · M · vendor**

**Now:** `useMyStoreReviewsQuery` (`src/features/vendors/api/vendor.api.ts:205`) is used by no
component. `vendorDashboardLinks` (`dashboard-navlink.ts:163-180`) has no Reviews entry.

**Gap:** Buyers rate stores and the ratings show on the storefront, but a seller cannot list their
own reviews. Their only route is visiting their public `/stores/[slug]` as a shopper. (This gap is
already noted in `CLAUDE.md`; it is confirmed and quantified here.)

**Fix:** Add `/vendor/reviews` using `useMyStoreReviewsQuery` and the shared `DataTable`, plus one
`dashboard-navlink.ts` entry. The backend endpoint exists; only the screen is missing.

---

### FE-20 · Two wishlist pages, one an empty shell
**P1 · S · storefront**

**Now:** `/dashboard/wishlist` is the real one. `src/app/(root)/wish-list/page.tsx:8` renders a
heading above an empty `<div>` grid.

**Gap:** A public `/wish-list` URL that always looks like an empty wishlist, regardless of
contents. The footer's broken `/dashboard-wishlist` link (FE-10) suggests the split confused
someone already.

**Fix:** Delete `(root)/wish-list` and redirect it to `/dashboard/wishlist`, or render the same
component in both.

---

### FE-21 · Product reviews are not gated on purchase
**P1 · M · reviews**

**Now:** `src/features/reviews/components/review-section/review-section.tsx:51` gates
`WriteReview` on being logged in, and nothing more.

**Gap:** Any signed-in user can review any product they have never bought. Store reviews are
correctly gated — `VendorReview` is tied to a delivered vendor order, one per order — so the
product path is the inconsistent one.

**Fix:** Needs a backend rule first: verify a delivered `OrderItem` for this `(userId, productId)`
before accepting a `Review`. Then hide `WriteReview` unless the product appears in the user's
delivered orders.

---

## P2 — cleanup, and features never started

### FE-22 · Customer `/dashboard` is a link grid, not a dashboard
**P2 · M · dashboard**

`src/app/(dashboard)/dashboard/page.tsx` maps over `customerDashboardLinks` and renders one card
per sidebar entry — a second copy of the navigation. No order count, no spend, no recent activity,
no open refunds. The vendor dashboard beside it is a real dashboard.

---

### FE-23 · Eighteen defined-but-never-called endpoints
**P2 · M · api**

Each is a screen that was planned and not built. Beyond FE-14, FE-18 and FE-19:

| Hook | Defined at | Missing screen |
| --- | --- | --- |
| `useRecordManualRefundMutation` | `refunds/api/refund.api.ts:82` | manual (cash) refund entry |
| `useDeleteUserMutation` | `users/api/user.api.ts:48` | user delete — and it would 404 (XR-02) |
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
- `src/features/home/api/slide.api.ts:37` declares `providesTags: ["products"]` where it means
  `["slides"]` — so updating a slide does not refresh `slideById`, and reading one needlessly
  couples to the product cache.

All invalidation is coarse whole-tag; no `{ type, id }` is used anywhere, so any mutation drops
the entire list cache for that resource. Acceptable at this scale, worth knowing.

---

### FE-25 · Seven orphaned component files
**P2 · S · cleanup**

`features/home/components/{featured-product,new-arrivals,offer,showcase,trending-product}.tsx`
(FE-03), `features/users/components/user-management-table.tsx` (FE-08),
`shared/components/td-drawer.tsx`.

Five of the seven are wanted by FE-03 — wire them up rather than delete them.

The four `products/components/filters/*` files this list used to name are **resolved**: FE-01
rewrote `price-filter.tsx` and deleted `brand`, `category` and `size` — each hardcoded a list the
server now serves as a facet.

---

### FE-26 · Five stray `console.log`s
**P2 · S · cleanup**

`forgot-password-form.tsx:24` (which **is** the feature — FE-04),
`brands/components/edit-brand.tsx:44` (harmless leftover after a working mutation),
`products/components/product-details/related-products.tsx:21`,
`home/components/new-arrivals.tsx:17` (swallows a fetch error),
`shared/lib/delete-temp-image.ts:13` (swallows the error).

The four `console.error`s in `auth-options.ts` and `TDImageUpload.tsx` are legitimate.

---

### FE-27 · Thirty-nine `any`s, eight of them in type definitions
**P2 · M · types**

`pnpm lint` passes at **52 warnings / 0 errors**; treat that as the baseline and do not add to it.

- **26 are `catch (error: any)`** followed by `error?.data?.message`, with no shared helper.
  `reviews/components/review-section/write-review.tsx:36` uses `error.data.message` **without**
  optional chaining, so a network failure throws inside the catch block.
- **8 are `any` in type definitions**, which defeats the point of the type layer:
  `orders/types/order.types.ts:51-57` (`transactionId`, `paymentGateway`, `gatewayResponse`,
  `failureReason`, `paidAt`, `refundedAt`, `refundAmount`) and `auth/types/auth.types.ts:5`
  (`phone: any`).
- 4 are `as any` around `form.setValue` in `shared/form/TDImageUpload.tsx:57,58,139,140`.

**Fix:** Extract one `getApiErrorMessage(error)` helper and replace all 26 catches — that alone
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
Icon-only buttons with no accessible name (e.g. `admin/user/page.tsx:105`). Search inputs with no
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

Beyond FE-19: no vendor analytics or time series (`orderAnalytics` is admin-only); no vendor order
detail page (`useVendorOrderByIdQuery` unused — the table is the only view); no payout detail; no
Profile entry in `vendorDashboardLinks`, unlike admin and customer; no rejection-reason surface, so
a seller sees a REJECTED badge without the reason; no view of refunds against their own orders; no
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
| FE-37 | Category browsing | `/categories/[slug]` is a placeholder (FE-07); no `/categories` index |
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
- `DELETE /users/:id` (`src/features/users/api/user.api.ts:48-53`) — no such backend route.

**Backend routes nothing here calls:** `POST /auth/forgot-password` and `POST /auth/reset-password` (FE-04, XR-11);
`GET /products/:productId/variants` and `/images` (both arrive nested on the product);
`GET /wishlists/:id`; `PATCH`/`DELETE /vendor-reviews/:id`; `GET /vendor-reviews/my-reviews`
(FE-19); `GET /address` admin list; the slide write CRUD (FE-14); `GET /payouts/:id`;
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

### XR-04 · A rating-only review always 400s
**P1 · S · contract**

`write-review.tsx:23` initialises `comment: ""` and `:33` submits the form values verbatim. The
backend declares `comment: z.string().min(5).max(400).trim().optional()` — an empty string is
*present*, so `.optional()` does not apply and `.min(5)` fires.

Every buyer who rates a product without writing a comment gets a 400 whose message reads
**"Min length is 2"**. And `:36` catches it with `error.data.message` — no optional chaining — so
a network error throws inside the catch.

**Fix here:** strip an empty `comment` before submitting, and use `error?.data?.message`.
**Fix there:** preprocess empty-to-undefined and correct the message string. Either alone closes
it.

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
| `TSlide` has no `sortOrder`/`isActive` | both exist on the backend model and should drive ordering |
| `ShippingSnapshot.state` required, no `email` (`order.types.ts:5-19`) | `Address.state` is nullable and `email` is required. `TAddress.state?` gets this right — the two are internally inconsistent |

**~~Two are~~ One is genuinely backend-side:** the missing `size` include.

~~`GET /users` returning no email, role or `meta`~~ — **fixed backend-side 2026-09-22 (BE-15 +
BE-20)**. `meta` is returned, and `email` and `role` now arrive **flat**, exactly as `TUser`
already declares them. The backend chose flattening over nesting under `auth` specifically so this
side would not have to change: `TUser` was right and the API was wrong. `row.email` and `row.role`
in `user-management-columns.tsx` render real values now, and `DataTable` gets its pagination.

Two caveats for whoever picks up **FE-08**:
- **The search box now honours its own placeholder.** *"Search by name, email…"* previously
  searched name and phone only; `?search=` now also matches email, case-insensitively.
- **`email` and `role` may be `null`** on a user with no `Auth` row (an account that cannot sign
  in at all). `TUser` types both as required `string`; treat them as `string | null` if you touch
  that type.

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

### XR-11 · Password reset — backend done, this side pending
**P1 · M · auth**

**Updated 2026-09-22.** The backend half has landed; **this side is now the only thing missing.**

| Piece | State |
| --- | --- |
| `POST /auth/forgot-password` | ✅ emails a single-use link, generic 200, token never in the body |
| `POST /auth/reset-password` | ✅ redeems the token and sets the new password |
| Email delivery + token storage | ✅ SHA-256 hashed, TTL, single-use, supersede, per-account cooldown |
| Forgot-password form here | ❌ still `console.log(data)` (FE-04) |
| `/reset-password` page here | ❌ does not exist |

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
