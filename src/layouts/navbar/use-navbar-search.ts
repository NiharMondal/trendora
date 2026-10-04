"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

/** The only route that reads `?search=`, so the only one the box mirrors. */
const CATALOGUE_PATH = "/products";

/**
 * Both navbar search boxes, shared so the two cannot disagree about where a
 * search goes — or about what they are currently showing.
 *
 * The box is a **controlled input seeded from the URL**, not a standalone
 * scratchpad. Getting that wrong is visible: search "nike" from here, then
 * clear the catalogue's own toolbar input, and the navbar goes on displaying
 * "nike" for a search that is no longer running. The URL is the single source
 * of truth; this keeps a local draft only for what the shopper has typed but
 * not yet submitted.
 *
 * Off `/products` the box shows nothing, because no search is running there.
 * Going back restores the term with the rest of the query.
 */
export function useNavbarSearch(onNavigate?: () => void) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlTerm =
        pathname === CATALOGUE_PATH ? (searchParams.get("search") ?? "") : "";

    // Reset-on-change rather than an effect: adjusting state during render is
    // React's documented pattern for "derive from a prop but stay editable",
    // and it repaints in the same commit instead of flashing the stale term.
    // `urlTerm` only moves on navigation, so it never clobbers mid-typing.
    const [query, setQuery] = useState(urlTerm);
    const [syncedTerm, setSyncedTerm] = useState(urlTerm);

    if (urlTerm !== syncedTerm) {
        setSyncedTerm(urlTerm);
        setQuery(urlTerm);
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const term = query.trim();

        // A search from the global box starts a NEW result set rather than
        // merging into whichever brand/price filters the shopper left behind
        // on /products — pushing the bare path is what clears them. An empty
        // submit is therefore "show me everything", not a no-op.
        router.push(
            term
                ? `${CATALOGUE_PATH}?search=${encodeURIComponent(term)}`
                : CATALOGUE_PATH,
        );

        onNavigate?.();
    };

    return { query, setQuery, handleSubmit };
}
