"use client";

import ErrorState from "@/shared/components/error-state";

export default function StorefrontError({
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
            className="min-h-[60vh]"
        />
    );
}
