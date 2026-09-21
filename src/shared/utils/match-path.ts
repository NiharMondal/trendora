/**
 * How well `href` matches `pathname`, for "which nav entry is active" checks.
 * 0 means no match. An exact hit outranks a prefix hit and a longer prefix
 * outranks a shorter one, so "/admin" never steals the highlight from
 * "/admin/brand-list" and "/admin/product-list" keeps it on
 * "/admin/product-list/update-product/<id>".
 */
export const pathMatchScore = (href: string, pathname: string): number => {
    if (!href) return 0;
    if (pathname === href) return href.length + 1;
    return pathname.startsWith(`${href}/`) ? href.length : 0;
};

/** Index of the best-matching href in the list, or -1 when none match. */
export const bestMatchIndex = (hrefs: string[], pathname: string): number => {
    let index = -1;
    let best = 0;

    hrefs.forEach((href, i) => {
        const score = pathMatchScore(href, pathname);
        if (score > best) {
            best = score;
            index = i;
        }
    });

    return index;
};
