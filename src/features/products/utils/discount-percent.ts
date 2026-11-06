/** Whole-number saving of `discountPrice` off `basePrice`; 0 when there is none. */
export function getDiscountPercent(
    basePrice: string | undefined,
    discountPrice: string | null | undefined,
) {
    const base = Number(basePrice);
    const discounted = Number(discountPrice);
    if (!discountPrice || !(base > 0) || !(discounted < base)) return 0;
    return Math.round((1 - discounted / base) * 100);
}
