"use client";

import ErrorState from "@/shared/components/error-state";

export default function AuthError({
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
            homeHref="/login"
            homeLabel="Back to login"
        />
    );
}
