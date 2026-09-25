/**
 * The home page's "Featured" rail and the admin screen that curates it share
 * one query, so the admin sees exactly the set shoppers are shown.
 *
 * `/products` already applies the storefront gates (approved + published +
 * approved store), so a featured draft is correctly left out of both.
 * Newest-first means that when more products are featured than the rail
 * holds, the most recently listed win.
 */
export const FEATURED_RAIL_LIMIT = 10;

export const featuredRailQuery = {
    isFeatured: "true",
    limit: String(FEATURED_RAIL_LIMIT),
    sortBy: "createdAt:desc",
} as const;
