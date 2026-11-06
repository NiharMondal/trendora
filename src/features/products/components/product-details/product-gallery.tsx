"use client";

import { Expand, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { TProductImage } from "@/features/products/types/product.types";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type Props = {
    images: TProductImage[] | undefined;
    productName: string;
};

/**
 * Main photo plus thumbnails; clicking the main photo opens the fullscreen
 * viewer. Every image is registered with the viewer so it can be swiped
 * through, but only the selected one renders a trigger — which is also what
 * makes the viewer open on the photo being looked at, not always the first.
 */
export default function ProductGallery({ images = [], productName }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-2xl bg-muted text-muted-foreground">
                <ImageOff className="size-10" strokeWidth={1.5} />
                <span className="text-sm">No image</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 lg:flex-row-reverse">
            <PhotoProvider onIndexChange={setCurrentIndex}>
                <div className="relative flex-1">
                    {images.map((img, index) => (
                        <PhotoView src={img.url} key={img.id}>
                            {index === currentIndex ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    aria-label={`Open photo ${index + 1} of ${images.length} fullscreen`}
                                    className="group relative block aspect-[4/5] h-auto w-full cursor-zoom-in overflow-hidden rounded-2xl bg-muted p-0 hover:bg-muted"
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.altText || productName}
                                        fill
                                        priority
                                        sizes="(min-width: 1024px) 50vw, 100vw"
                                        className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                                    />
                                    <span className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition group-hover:scale-105">
                                        <Expand className="size-4" aria-hidden="true" />
                                    </span>
                                </Button>
                            ) : undefined}
                        </PhotoView>
                    ))}
                </div>
            </PhotoProvider>

            {images.length > 1 && (
                // A scroll container clips anything painted past its padding
                // box — including the selected thumbnail's ring, which sits
                // 4px outside it (2px ring + 2px offset). `p-1` gives the ring
                // room; `-m-1` cancels it so the strip keeps its position.
                <div className="-m-1 flex gap-3 overflow-x-auto p-1 lg:max-h-[648px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
                    {images.map((img, index) => (
                        // A button, not a clickable <Image>: keyboard users could
                        // not switch photos before.
                        <Button
                            key={img.id}
                            type="button"
                            variant="ghost"
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Show photo ${index + 1} of ${images.length}`}
                            aria-pressed={index === currentIndex}
                            className={cn(
                                "relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-muted p-0 ring-offset-2 ring-offset-background hover:bg-muted",
                                index === currentIndex
                                    ? "ring-2 ring-primary"
                                    : "opacity-70 hover:opacity-100",
                            )}
                        >
                            <Image
                                src={img.url}
                                alt=""
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
