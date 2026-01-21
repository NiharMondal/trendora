"use client";

import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useAllSlideQuery } from "@/redux/api/slideApi";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import SpinnerLoading from "../common/spinner-loading";
import TDButton from "../common/td-button";

export function HeroSlider() {
    const { data, isLoading } = useAllSlideQuery({ limit: "5" });
    const [api, setApi] = useState<CarouselApi>();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    useEffect(() => {
        if (!api) return;

        setScrollSnaps(api.scrollSnapList());
        setSelectedIndex(api.selectedScrollSnap());

        api.on("select", () => {
            setSelectedIndex(api.selectedScrollSnap());
        });
    }, [api]);

    if (isLoading) {
        return <SpinnerLoading className="min-h-[calc(100vh-80px)]" />;
    }
    return (
        <div className="min-w-full relative">
            <Carousel setApi={setApi}>
                <CarouselContent className="h-[600px] md:h-[calc(100vh-80px)]">
                    {data?.result.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className="h-full relative flex items-center pr-5 pl-8 sm:pl-10 md:pl-20 lg:pl-28 xl:pl-40"
                            style={{
                                backgroundImage: `url(${item.photoUrl})`,
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                // backgroundColor: "red",
                            }}
                        >
                            <div className=" bg-black/50 p-5 sm:p-8 md:p-16 rounded-md space-y-5 text-white md:min-w-lg">
                                <h1 className="max-w-2xl">{item.title}</h1>
                                <p className="font-inter font-medium">
                                    {item.subtitle}
                                </p>
                                <Link href={item.url}>
                                    <TDButton
                                        size="lg"
                                        className="text-2xl font-semibold"
                                    >
                                        Shop Now
                                    </TDButton>
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn("size-3 bg-muted rounded-full", {
                            "ring-2 ring-primary border-2 border-primary ring-offset-2 bg-white":
                                index === selectedIndex,
                        })}
                    />
                ))}
            </div>
        </div>
    );
}
