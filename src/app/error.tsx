"use client";

import ErrorState from "@/shared/components/error-state";

export default function AppError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorState
            digest={error.digest}
            reset={reset}
            homeHref="/"
            homeLabel="Go to home page"
        />
    );
}
