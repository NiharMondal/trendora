import { Compass } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import Container from "@/shared/components/container";
import { Button } from "@/shared/ui/button";

export const metadata: Metadata = {
    title: "Trendora | Page not found",
};

/**
 * Every unmatched URL lands here — storefront, dashboard and auth alike — and
 * it renders under the root layout only, outside every route group's chrome.
 * So it carries its own minimal header rather than the storefront navbar
 * (whose search hook would also need a Suspense boundary here).
 */
export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex h-16 items-center border-b bg-background">
                <Container>
                    <Link href="/" className="text-2xl font-bold">
                        Trendora
                    </Link>
                </Container>
            </header>
            <main
                id="main-content"
                tabIndex={-1}
                className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center outline-none"
            >
                <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
                    <Compass
                        className="size-9 text-primary"
                        strokeWidth={1.5}
                    />
                </div>
                <div className="max-w-md space-y-2">
                    <p className="text-sm font-semibold text-primary">404</p>
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        We couldn&apos;t find that page
                    </h1>
                    <p className="text-muted-foreground">
                        The link may be broken, or the page may have moved.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button asChild>
                        <Link href="/products">Browse products</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/">Go to home page</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
