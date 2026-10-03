export const allSortOptions = [
    { label: "CreatedAt (Asc)", value: "createdAt:asc" },
    { label: "CreatedAt (Desc)", value: "createdAt:desc" },
    { label: "Name (A-Z)", value: "name:asc" },
    { label: "Name (Z-A)", value: "name:desc" },
    { label: "Price (Low to High)", value: "basePrice:asc" },
    { label: "Price (High to Low)", value: "basePrice:desc" },
];

export const categorySortOptions = [
    { label: "CreatedAt (Asc)", value: "createdAt:asc" },
    { label: "CreatedAt (Desc)", value: "createdAt:desc" },
    { label: "Name (A-Z)", value: "name:asc" },
    { label: "Name (Z-A)", value: "name:desc" },
];
export const userSortOptions = [
    { label: "CreatedAt (Asc)", value: "createdAt:asc" },
    { label: "CreatedAt (Desc)", value: "createdAt:desc" },
    { label: "Name (A-Z)", value: "name:asc" },
    { label: "Name (Z-A)", value: "name:desc" },
    { label: "Email (A-Z)", value: "email:asc" },
    { label: "Email (Z-A)", value: "email:desc" },
];

export const reviewSortOptions = [
    { label: "CreatedAt (Asc)", value: "createdAt:asc" },
    { label: "CreatedAt (Desc)", value: "createdAt:desc" },
    { label: "Rating (Low to High)", value: "rating:asc" },
    { label: "Rating (High to Low)", value: "rating:desc" },
];

/**
 * Storefront catalogue sort. `basePrice` is deliberate: Prisma cannot order by
 * "discountPrice where there is one, basePrice otherwise" without a generated
 * column, so a discounted item sorts by its pre-discount price even though the
 * price FILTER matches on what the shopper is shown.
 */
export const storefrontSortOptions = [
    { label: "Newest first", value: "createdAt:desc" },
    { label: "Price (Low to High)", value: "basePrice:asc" },
    { label: "Price (High to Low)", value: "basePrice:desc" },
    { label: "Top rated", value: "averageRating:desc" },
    { label: "Name (A-Z)", value: "name:asc" },
];
