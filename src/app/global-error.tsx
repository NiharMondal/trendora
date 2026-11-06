"use client";

import "./globals.css";

/**
 * Last-resort boundary: catches an error thrown by the root layout itself
 * (including `Providers`). It REPLACES that layout, so it renders its own
 * `<html>`/`<body>` and depends on nothing the providers set up — no session,
 * no store, no client router. Links are plain `<a>` so recovery is a full reload.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <main
                    role="alert"
                    className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center"
                >
                    <p className="text-2xl font-bold">Trendora</p>
                    <div className="max-w-md space-y-2">
                        <h1 className="text-2xl font-semibold">
                            Something went wrong
                        </h1>
                        <p className="text-muted-foreground">
                            Trendora failed to load. Please try again in a
                            moment.
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground">
                                Error reference: <code>{error.digest}</code>
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={reset}
                            className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            Try again
                        </button>
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full reload is the point here */}
                        <a
                            href="/"
                            className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium hover:bg-muted"
                        >
                            Go to home page
                        </a>
                    </div>
                </main>
            </body>
        </html>
    );
}
