"use client";

import { useSession } from "next-auth/react";

import { roleHomePath } from "@/features/auth/utils/role-home";
import ErrorState from "@/shared/components/error-state";

// Rendered inside `(dashboard)/layout.tsx`, so the sidebar survives and the
// user can navigate away without the boundary's own link.
export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const { data: session } = useSession();

    return (
        <ErrorState
            digest={error.digest}
            reset={reset}
            homeHref={roleHomePath(session?.user?.role)}
            homeLabel="Back to dashboard"
            className="rounded-xl bg-background"
        />
    );
}
