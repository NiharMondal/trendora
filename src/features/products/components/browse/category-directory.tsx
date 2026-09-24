"use client";

import { FolderSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useProductFiltersQuery } from "@/features/products/api/product.api";
import { TCategoryFacet } from "@/features/products/types/product-filter.types";
import Container from "@/shared/components/container";
import NoDataFound from "@/shared/components/no-data-found";
import QueryError from "@/shared/components/query-error";
import { Skeleton } from "@/shared/ui/skeleton";

const itemCount = (count: number) => `${count} ${count === 1 ? "item" : "items"}`;

/**
 * `/categories` — every category that has something to buy, as a tree.
 *
 * Sourced from `GET /products/filters`, for the reason `CategoryTiles`
 * documents: the admin taxonomy is aspirational and most of it is empty, and a
 * directory of doors onto "no products found" is worse than no directory. The
 * facets endpoint returns only categories with live stock, each with a count.
 *
 * Every link goes to the catalogue (`/products?categoryId=`), never a second
 * product list. A parent's count is rolled up from its children server-side,
 * and `categoryId` matches the category or its children, so a parent is a
 * real, non-empty destination.
 */
export default function CategoryDirectory() {
    const { data, isLoading, error, refetch } = useProductFiltersQuery({});

    if (error) {
        return (
            <Container className="py-10">
                <QueryError
                    error={error}
                    onRetry={refetch}
                    title="Could not load categories"
                />
            </Container>
        );
    }

    const categories = data?.result?.categories ?? [];
    const ids = new Set(categories.map((category) => category.id));
    // A child whose parent is missing from the facets is shown at the top
    // level rather than dropped.
    const roots = categories
        .filter((category) => !category.parentId || !ids.has(category.parentId))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    const childrenOf = (parent: TCategoryFacet) =>
        categories
            .filter((category) => category.parentId === parent.id)
            .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <Container className="py-10 space-y-8">
            <div className="space-y-1">
                <h1 className="text-3xl font-semibold">Shop by category</h1>
                <p className="text-sm text-muted-foreground">
                    Every category with something in stock right now.
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }, (_, index) => (
                        <Skeleton key={index} className="h-56 w-full rounded-lg" />
                    ))}
                </div>
            ) : roots.length === 0 ? (
                <NoDataFound
                    icon={FolderSearch}
                    title="Nothing to browse yet"
                    description="Categories appear here as soon as sellers list products in them."
                />
            ) : (
                <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {roots.map((category) => {
                        const children = childrenOf(category);
                        return (
                            <li
                                key={category.id}
                                className="overflow-hidden rounded-lg border bg-white"
                            >
                                <Link
                                    href={`/products?categoryId=${category.id}`}
                                    className="group relative block h-36 overflow-hidden bg-primary-100"
                                >
                                    {category.image ? (
                                        <Image
                                            src={category.image}
                                            alt=""
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div
                                            aria-hidden
                                            className="absolute inset-0 bg-gradient-to-br from-primary-300 to-primary-600 transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <span className="text-xl font-semibold text-white">
                                            {category.name}
                                        </span>
                                        <span className="shrink-0 text-xs text-white/80">
                                            {itemCount(category.count)}
                                        </span>
                                    </div>
                                </Link>

                                {children.length > 0 && (
                                    <ul
                                        aria-label={`${category.name} subcategories`}
                                        className="divide-y text-sm"
                                    >
                                        {children.map((child) => (
                                            <li key={child.id}>
                                                <Link
                                                    href={`/products?categoryId=${child.id}`}
                                                    className="flex items-center justify-between px-4 py-2.5 hover:bg-muted hover:text-primary"
                                                >
                                                    <span>{child.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {itemCount(child.count)}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </Container>
    );
}
