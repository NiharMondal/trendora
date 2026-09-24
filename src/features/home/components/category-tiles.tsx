"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useProductFiltersQuery } from "@/features/products/api/product.api";
import Container from "@/shared/components/container";
import { Skeleton } from "@/shared/ui/skeleton";

/** A wall of tiles stops being navigation and becomes a list. */
const MAX_TILES = 8;

/**
 * "Shop by category" — the storefront's primary discovery aid.
 *
 * Sourced from `GET /products/filters`, **not** `GET /categories`, and that is
 * the whole design. The taxonomy is admin-owned and aspirational: it carries
 * Belt, Bag, Heels, Dress and a dozen more that nobody has listed a product
 * in yet. Tiling all of them hands the shopper seventeen doors, most of which
 * open onto "no products found". The facets endpoint returns only categories
 * with live, approved, published stock, so every tile here is guaranteed to
 * land on results.
 *
 * Only **top-level** categories are tiled. The taxonomy is two deep
 * (Footwear -> Sneakers) and the server rolls a parent's count up from its
 * children, so "Footwear" is both a real destination and a non-empty one.
 *
 * `image` is nullable and most categories have none yet, so a tile without
 * artwork gets a gradient rather than a broken frame.
 */
export default function CategoryTiles() {
    const { data, isLoading } = useProductFiltersQuery({});

    const categories = (data?.result?.categories ?? [])
        .filter((category) => !category.parentId)
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_TILES);

    if (!isLoading && categories.length === 0) return null;

    return (
        <section className="py-10">
            <Container className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold">Shop by category</h2>
                        <p className="text-sm text-muted-foreground">
                            Jump straight to what you came for.
                        </p>
                    </div>
                    {/* The tiles stop at MAX_TILES top-level categories; the
                        index has all of them, with their subcategories. */}
                    <Link
                        href="/categories"
                        className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                        All categories
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {isLoading
                        ? Array.from({ length: 4 }, (_, index) => (
                              <Skeleton
                                  key={index}
                                  className="h-[160px] w-full rounded-lg"
                              />
                          ))
                        : categories.map((category) => (
                              <Link
                                  key={category.id}
                                  href={`/products?categoryId=${category.id}`}
                                  className="group relative block h-[160px] overflow-hidden rounded-lg bg-primary-100"
                              >
                                  {category.image ? (
                                      <Image
                                          src={category.image}
                                          alt={category.name}
                                          fill
                                          sizes="(max-width: 768px) 50vw, 25vw"
                                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                                      />
                                  ) : (
                                      <div
                                          aria-hidden
                                          className="absolute inset-0 bg-gradient-to-br from-primary-300 to-primary-600 transition-transform duration-500 group-hover:scale-110"
                                      />
                                  )}

                                  <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-4">
                                      <span className="text-lg font-semibold text-white">
                                          {category.name}
                                      </span>
                                      <span className="shrink-0 text-xs text-white/80">
                                          {category.count}{" "}
                                          {category.count === 1
                                              ? "item"
                                              : "items"}
                                      </span>
                                  </div>
                              </Link>
                          ))}
                </div>
            </Container>
        </section>
    );
}
