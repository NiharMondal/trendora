"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { useAllBrandQuery } from "@/features/brands/api/brand.api";
import Container from "@/shared/components/container";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * A thin row of brand chips. Recognisable names are a trust signal on a
 * marketplace where the seller is usually unfamiliar.
 *
 * `Brand.logo` exists but is null across the board today, so the chip is
 * typographic and shows the logo only when there is one — rather than
 * reserving an image slot that is empty for every brand.
 */
export default function BrandStrip() {
    const { data, isLoading } = useAllBrandQuery({ limit: "16" });

    const brands = data?.result ?? [];

    if (!isLoading && brands.length === 0) return null;

    return (
        <section className="py-10">
            <Container className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                    <h2 className="text-2xl font-semibold">Shop by brand</h2>
                    <Link
                        href="/brands"
                        className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                        All brands
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <div className="flex flex-wrap gap-3">
                    {isLoading
                        ? Array.from({ length: 6 }, (_, index) => (
                              <Skeleton key={index} className="h-11 w-32 rounded-full" />
                          ))
                        : brands.map((brand) => (
                              <Link
                                  key={brand.id}
                                  href={`/products?brandId=${brand.id}`}
                                  className="flex h-11 items-center gap-2 rounded-full border border-muted bg-white px-5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                              >
                                  {brand.logo && (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                          src={brand.logo}
                                          alt=""
                                          aria-hidden
                                          className="size-5 rounded-full object-cover"
                                      />
                                  )}
                                  {brand.name}
                              </Link>
                          ))}
                </div>
            </Container>
        </section>
    );
}
