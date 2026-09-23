/**
 * The storefront filter panel's options, as served by `GET /products/filters`.
 *
 * These are derived from the live catalogue rather than declared here on
 * purpose: sellers list whatever they like, so which brands, categories and
 * sizes exist is a property of the data. A hardcoded list goes stale the first
 * time a vendor opens a new category, and it cannot know the counts.
 */

/** Every option carries the number of products ticking it would leave. */
type TFacetCount = { count: number };

export type TCategoryFacet = TFacetCount & {
    id: string;
    name: string;
    slug: string;
};

export type TBrandFacet = TFacetCount & {
    id: string;
    name: string;
    logo: string | null;
};

export type TStoreFacet = TFacetCount & {
    id: string;
    storeName: string;
    slug: string;
    logo: string | null;
};

export type TGenderFacet = TFacetCount & {
    value: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
};

export type TSizeFacet = TFacetCount & {
    id: string;
    name: string;
    /** The group the size belongs to ("Clothing", "Footwear"), for headings. */
    sizeGroup: string | null;
};

export type TRatingFacet = TFacetCount & {
    /** "n stars and up". */
    value: number;
};

export type TProductFacets = {
    /** Matches for the filters already applied — the panel's "n results". */
    totalProducts: number;
    /** Range of the price actually shown (discounted where discounted). */
    price: { min: number; max: number };
    categories: TCategoryFacet[];
    brands: TBrandFacet[];
    stores: TStoreFacet[];
    genders: TGenderFacet[];
    sizes: TSizeFacet[];
    ratings: TRatingFacet[];
};
