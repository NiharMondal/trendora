"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

import TDButton from "@/shared/components/td-button";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type ErrorStateProps = {
    title?: string;
    description?: string;
    /** Next's `digest` — the id that matches the server log line in production. */
    digest?: string;
    /** The `reset` an `error.tsx` boundary receives. Omit to hide "Try again". */
    reset?: () => void;
    homeHref?: string;
    homeLabel?: string;
    icon?: React.ElementType;
    className?: string;
};

/**
 * The one "something went wrong" screen, shared by every `error.tsx` boundary so
 * they cannot drift. `global-error.tsx` does not use it: it replaces the root
 * layout, so it must not depend on anything the providers set up.
 */
export default function ErrorState({
    title = "Something went wrong",
    description = "An unexpected error stopped this page from loading. Please try again.",
    digest,
    reset,
    homeHref = "/",
    homeLabel = "Go to home page",
    icon: Icon = AlertTriangle,
    className,
}: ErrorStateProps) {
    const router = useRouter();
    const [isRetrying, startTransition] = useTransition();

    // `reset()` alone only re-renders the client tree; an error thrown by a
    // server component needs its payload re-fetched, which is `router.refresh()`.
    const retry = () =>
        startTransition(() => {
            router.refresh();
            reset?.();
        });

    return (
        <div
            role="alert"
            className={cn(
                "flex min-h-[400px] w-full flex-col items-center justify-center gap-6 p-8 text-center",
                className,
            )}
        >
            <div className="flex size-20 items-center justify-center rounded-full bg-destructive-50 ring-8 ring-destructive-50/50">
                <Icon className="size-9 text-destructive" strokeWidth={1.5} />
            </div>
            <div className="max-w-md space-y-2">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                    {description}
                </p>
                {digest && (
                    <p className="text-xs text-muted-foreground">
                        Error reference: <code>{digest}</code>
                    </p>
                )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
                {reset && (
                    <TDButton onClick={retry} isLoading={isRetrying}>
                        Try again
                    </TDButton>
                )}
                <Button variant="outline" asChild>
                    <Link href={homeHref}>{homeLabel}</Link>
                </Button>
            </div>
        </div>
    );
}
