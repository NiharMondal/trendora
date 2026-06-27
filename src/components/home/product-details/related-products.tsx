"use client";
import { useEffect, useState } from "react";

import ProductCard from "@/components/common/product-card/product-card";
import SectionHeader from "@/components/common/shared/section-header";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useRelatedProductsQuery } from "@/redux/api/productApi";

export default function RelatedProducts({ productId }: { productId: string }) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    const { data: relatedProducts } = useRelatedProductsQuery(productId, {
        skip: !productId,
    });

    console.log("relatedProducts", relatedProducts);

    useEffect(() => {
        if (!api) return;

        const onSelect = () => setCurrent(api.selectedScrollSnap());

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
    }, [api, relatedProducts]);
    return (
        <div className="mt-10 space-y-5">
            <SectionHeader title="Related Product" />

            <Carousel setApi={setApi} opts={{ align: "start" }}>
                <CarouselContent>
                    {relatedProducts?.result.map((product) => (
                        <CarouselItem
                            className="basis-1/1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                            key={product.id}
                        >
                            <ProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden xl:block">
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
            </Carousel>

            {/** Indicators */}
            <div className="flex justify-center gap-2 xl:hidden">
                {Array.from({ length: count }).map((_, index) => (
                    <Button
                        key={index}
                        size="icon"
                        // variant={current === index ? "default" : "outline"}
                        className="h-3 w-3 rounded-full p-0"
                        onClick={() => api?.scrollTo(index)}
                    >
                    </Button>
                ))}
            </div>
        </div>
    );
}
