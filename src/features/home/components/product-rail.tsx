"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { TProduct } from "@/features/products/types/product.types";
import ProductCard from "@/features/products/components/product-card/product-card";
import Container from "@/shared/components/container";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/shared/ui/carousel";

type ProductRailProps = {
    title: string;
    description?: string;
    /** Where "View all" goes — always a real, filtered catalogue URL. */
    /** The wider set this shelf previews. Omit when there is none. */
    href?: string;
    products?: TProduct[];
    isLoading: boolean;
    className?: string;
};

/**
 * One horizontally-scrolling shelf of products. Four home sections are the
 * same shelf with a different query behind them, so they share this rather
 * than each carrying a copy of the carousel wiring.
 *
 * **A rail with nothing in it renders nothing at all.** A marketplace with no
 * completed orders has no best sellers, and one with no markdowns has no
 * deals — an empty shelf under a confident heading reads as a broken page, so
 * the section removes itself instead. That is also why every rail's data is
 * fetched by its own small wrapper: the decision to disappear has to happen
 * after the fetch, not in the page that composes them.
 */
export default function ProductRail({
    title,
    description,
    href,
    products,
    isLoading,
    className,
}: ProductRailProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => setCurrent(api.selectedScrollSnap()));
    }, [api]);

    if (!isLoading && (!products || products.length === 0)) return null;

    return (
        <section className={cn("py-10", className)}>
            <Container className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold">{title}</h2>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    {href && (
                        <Link
                            href={href}
                            className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            View all
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div key={index} className="space-y-2">
                                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <Carousel setApi={setApi} opts={{ align: "start" }}>
                            <CarouselContent>
                                {products?.map((product) => (
                                    <CarouselItem
                                        key={product.id}
                                        className="basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                    >
                                        <ProductCard product={product} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Arrows are a pointer affordance; touch devices
                                swipe, and the dots below carry that job. */}
                            <div className="hidden md:block">
                                <CarouselPrevious />
                                <CarouselNext />
                            </div>
                        </Carousel>

                        {count > 1 && (
                            <div className="flex justify-center gap-2 md:hidden">
                                {Array.from({ length: count }, (_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        aria-label={`Go to slide ${index + 1}`}
                                        onClick={() => api?.scrollTo(index)}
                                        className={cn(
                                            "size-2.5 rounded-full transition-colors",
                                            current === index
                                                ? "bg-primary"
                                                : "bg-muted",
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </Container>
        </section>
    );
}
