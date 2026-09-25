"use client";

import { ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useAllProductsQuery } from "@/features/products/api/product.api";
import {
    FEATURED_RAIL_LIMIT,
    featuredRailQuery,
} from "@/features/products/constants/featured";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * The at-a-glance answer to "what are shoppers seeing?": the same query the
 * home page's rail runs, so what is shown here is exactly what is live.
 */
export default function FeaturedSummary() {
    const { data, isLoading } = useAllProductsQuery(featuredRailQuery);
    const products = data?.result ?? [];
    const total = data?.meta?.totalData ?? products.length;
    const overflow = total - FEATURED_RAIL_LIMIT;

    return (
        <section
            aria-labelledby="featured-summary-heading"
            className="space-y-4 rounded-md border bg-white p-5"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning-50 text-warning-600">
                        <Sparkles className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                        <h2
                            id="featured-summary-heading"
                            className="font-semibold"
                        >
                            On the home page now
                        </h2>
                        {isLoading ? (
                            <Skeleton className="mt-1 h-4 w-60" />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {total === 0
                                    ? "Nothing is featured, so the Featured rail is hidden from shoppers."
                                    : `${total} featured ${total === 1 ? "product" : "products"}` +
                                      (overflow > 0
                                          ? ` — the rail shows the newest ${FEATURED_RAIL_LIMIT}, so ${overflow} ${overflow === 1 ? "is" : "are"} not visible.`
                                          : " — all of them are visible in the rail.")}
                            </p>
                        )}
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-50 hover:text-foreground"
                    asChild
                >
                    <Link href="/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink />
                        View home page
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="flex gap-3">
                    {Array.from({ length: 5 }, (_, index) => (
                        <Skeleton key={index} className="size-16 rounded-md" />
                    ))}
                </div>
            ) : (
                products.length > 0 && (
                    <ul className="-m-1 flex gap-3 overflow-x-auto p-1">
                        {products.map((product) => {
                            const image =
                                product.images?.find((img) => img.isMain) ??
                                product.images?.[0];
                            return (
                                <li key={product.id} className="shrink-0">
                                    <Link
                                        href={`/products/${product.slug}`}
                                        title={product.name}
                                        className="relative block size-16 overflow-hidden rounded-md bg-muted ring-1 ring-border transition hover:ring-2 hover:ring-warning-500"
                                    >
                                        {image?.url && (
                                            <Image
                                                src={image.url}
                                                alt=""
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        )}
                                        <span className="sr-only">
                                            {product.name}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )
            )}
        </section>
    );
}
