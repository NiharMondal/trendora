"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

/**
 * The navigation half of both navbar search boxes, shared so the two cannot
 * disagree about where a search goes.
 *
 * It is deliberately **not** synced from the URL. The navbar is mounted in the
 * root layout, so calling `useSearchParams` here would opt every route in the
 * app out of static rendering — to show a term that the catalogue's own
 * toolbar input already displays. This box is a jumping-off point, not a
 * second source of truth for `?search=`.
 */
export function useNavbarSearch(onNavigate?: () => void) {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const term = query.trim();

        // A search from the global box starts a NEW result set rather than
        // merging into whichever brand/price filters the shopper left behind
        // on /products — pushing the bare path is what clears them. An empty
        // submit is therefore "show me everything", not a no-op.
        router.push(
            term ? `/products?search=${encodeURIComponent(term)}` : "/products",
        );

        onNavigate?.();
    };

    return { query, setQuery, handleSubmit };
}
