"use client";

import { SearchX, TriangleAlert } from "lucide-react";

import NoDataFound from "@/shared/components/no-data-found";
import { getApiErrorMessage, isNotFoundError } from "@/shared/utils/api-error";

type QueryErrorProps = {
    /** The `error` from an RTK Query hook. */
    error: unknown;
    /** Usually the hook's `refetch`. Omit to hide the retry button. */
    onRetry?: () => void;
    title?: string;
    /** Copy for a 404 — a missing record is not a failure and gets no retry. */
    notFound?: { title: string; description?: string };
    className?: string;
};

/**
 * The inline "this request failed" state, for the part of a page a query
 * feeds. A failed request must never render as an empty list: "you have no
 * orders" and "we could not load your orders" need different actions from the
 * user. `DataTable` renders this itself when given `error`.
 *
 * Render-time throws are a different thing and belong to the `error.tsx`
 * boundaries (`shared/components/error-state.tsx`).
 */
export default function QueryError({
    error,
    onRetry,
    title = "Could not load this",
    notFound,
    className,
}: QueryErrorProps) {
    if (notFound && isNotFoundError(error)) {
        return (
            <NoDataFound
                icon={SearchX}
                title={notFound.title}
                description={notFound.description ?? getApiErrorMessage(error)}
                className={className}
            />
        );
    }

    return (
        <NoDataFound
            icon={TriangleAlert}
            title={title}
            description={getApiErrorMessage(error)}
            className={className}
            {...(onRetry && { actionLabel: "Try again", onAction: onRetry })}
        />
    );
}
