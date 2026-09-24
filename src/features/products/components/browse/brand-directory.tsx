"use client";

import { Search, Tags } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useProductFiltersQuery } from "@/features/products/api/product.api";
import { TBrandFacet } from "@/features/products/types/product-filter.types";
import Container from "@/shared/components/container";
import NoDataFound from "@/shared/components/no-data-found";
import QueryError from "@/shared/components/query-error";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";

/** The letter a brand files under; digits and symbols share "#". */
const indexLetter = (name: string) => {
    const first = name.trim().charAt(0).toUpperCase();
    return /[A-Z]/.test(first) ? first : "#";
};

/**
 * `/brands` — every brand with something to buy, A to Z.
 *
 * Like `/categories`, this reads `GET /products/filters` rather than
 * `GET /brands`: the brand table is admin-owned and holds names nobody sells
 * yet, and each facet carries the number of live products behind it. A brand
 * has no slug, so every entry links straight to `/products?brandId=`, the
 * catalogue with all its filters, rather than to a brand page of its own.
 *
 * The name filter is local. The whole list arrives in one response, so
 * filtering it is instant and costs no request.
 */
export default function BrandDirectory() {
    const { data, isLoading, error, refetch } = useProductFiltersQuery({});
    const [query, setQuery] = useState("");

    if (error) {
        return (
            <Container className="py-10">
                <QueryError
                    error={error}
                    onRetry={refetch}
                    title="Could not load brands"
                />
            </Container>
        );
    }

    const all = data?.result?.brands ?? [];
    const needle = query.trim().toLowerCase();
    const brands = all
        .filter((brand) => brand.name.toLowerCase().includes(needle))
        .sort((a, b) => a.name.localeCompare(b.name));

    const groups = brands.reduce<Record<string, TBrandFacet[]>>(
        (acc, brand) => {
            (acc[indexLetter(brand.name)] ??= []).push(brand);
            return acc;
        },
        {},
    );
    const letters = Object.keys(groups).sort((a, b) =>
        a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b),
    );

    return (
        <Container className="py-10 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold">Shop by brand</h1>
                    <p className="text-sm text-muted-foreground">
                        {isLoading
                            ? "Loading brands…"
                            : `${all.length} brand${all.length === 1 ? "" : "s"} with something in stock.`}
                    </p>
                </div>
                {all.length > 8 && (
                    <div className="relative sm:w-64">
                        <Search
                            aria-hidden
                            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Find a brand"
                            aria-label="Filter brands by name"
                            className="pl-9 bg-white"
                        />
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }, (_, index) => (
                        <Skeleton key={index} className="h-16 w-full rounded-lg" />
                    ))}
                </div>
            ) : all.length === 0 ? (
                <NoDataFound
                    icon={Tags}
                    title="Nothing to browse yet"
                    description="Brands appear here as soon as sellers list products under them."
                />
            ) : brands.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No brand matches &ldquo;{query}&rdquo;.
                </p>
            ) : (
                <div className="space-y-8">
                    {/* Jump links only earn their space on a long list. */}
                    {letters.length > 5 && (
                        <nav aria-label="Brands by letter" className="flex flex-wrap gap-1">
                            {letters.map((letter) => (
                                <a
                                    key={letter}
                                    href={`#brands-${letter}`}
                                    className="flex size-8 items-center justify-center rounded text-sm font-medium hover:bg-primary-100 hover:text-primary"
                                >
                                    {letter}
                                </a>
                            ))}
                        </nav>
                    )}

                    {letters.map((letter) => (
                        <section
                            key={letter}
                            id={`brands-${letter}`}
                            aria-labelledby={`brands-${letter}-heading`}
                            className="space-y-3 scroll-mt-24"
                        >
                            <h2
                                id={`brands-${letter}-heading`}
                                className="text-lg font-semibold text-muted-foreground"
                            >
                                {letter}
                            </h2>
                            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {groups[letter].map((brand) => (
                                    <li key={brand.id}>
                                        <Link
                                            href={`/products?brandId=${brand.id}`}
                                            className="flex h-16 items-center gap-3 rounded-lg border bg-white px-4 transition-colors hover:border-primary hover:text-primary"
                                        >
                                            {brand.logo && (
                                                <Image
                                                    src={brand.logo}
                                                    alt=""
                                                    width={32}
                                                    height={32}
                                                    className="size-8 rounded-full object-cover"
                                                />
                                            )}
                                            <span className="flex-1 truncate font-medium">
                                                {brand.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {brand.count}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </Container>
    );
}
