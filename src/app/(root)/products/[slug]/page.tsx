"use client";
import Container from "@/components/common/container";
import ProductPrice from "@/components/common/product-card/product-price";
import ProductQuantity from "@/components/common/product-quantity";
import RelatedProducts from "@/components/common/related-product";
import SpinnerLoading from "@/components/common/spinner-loading";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useProductBySlugQuery } from "@/redux/api/productApi";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Heart, RefreshCw, ShoppingBag } from "lucide-react";
import Image from "next/image";
import React, { use, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

export default function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const { data, isLoading } = useProductBySlugQuery(slug);
    const product = data?.result;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState("");
    if (!product && isLoading) return <SpinnerLoading />;
    return (
        <Container className="py-10">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Photo section  */}
                <div className="space-y-3">
                    <PhotoProvider
                        onIndexChange={(newIndex) => setCurrentIndex(newIndex)}
                    >
                        {/* ⭐ MAIN IMAGE — click to open fullscreen viewer */}
                        {product?.images.map((item, index) => (
                            <PhotoView src={item.url} key={item.id}>
                                {index < 1 ? (
                                    <Image
                                        height={200}
                                        width={200}
                                        src={product?.images[currentIndex]?.url}
                                        alt="Main"
                                        className="w-full h-[600px] object-cover rounded cursor-crosshair"
                                        onClick={() =>
                                            setCurrentIndex(currentIndex)
                                        }
                                    />
                                ) : undefined}
                            </PhotoView>
                        ))}
                    </PhotoProvider>
                    {/* ⭐ THUMBNAILS */}
                    <div className="grid grid-cols-4 gap-4">
                        {product?.images.map((img, index) => (
                            <Image
                                key={img.id}
                                height={80}
                                width={100}
                                src={img.url}
                                alt="thumb"
                                className={cn(
                                    "h-20 w-full object-cover rounded cursor-pointer",
                                    index === currentIndex
                                        ? "ring-2 ring-blue-500"
                                        : ""
                                )}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* details section  */}
                <div className="space-y-5">
                    <h2>{product?.name}</h2>
                    <p>Rating section</p>
                    <ProductPrice
                        basePrice={product?.basePrice || ""}
                        discountPrice={product?.discountPrice}
                    />
                    <p>{product?.description}</p>
                    <hr className="border-t border-muted my-5" />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p>Variants:</p>
                            <Tooltip>
                                <TooltipTrigger
                                    onClick={() => setSelectedVariant("")}
                                    className="border p-2 rounded-full hover:text-destructive"
                                >
                                    <RefreshCw className="size-3 " />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Reset Variant</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 gap-3">
                            {product?.variants?.map((variant) => (
                                <div
                                    onClick={() =>
                                        setSelectedVariant(variant.id)
                                    }
                                    key={variant.id}
                                    className={cn(
                                        "cursor-pointer ring-1 ring-muted p-3 rounded-md text-sm font-light",
                                        {
                                            "ring-2 ring-primary":
                                                variant?.id === selectedVariant,
                                        }
                                    )}
                                >
                                    <p>Color: {variant.color}</p>
                                    <p>Size: {variant.size}</p>
                                    <p>Price: {variant.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr className="border-t border-muted my-5" />

                    <div className="space-y-2">
                        <p>Quantity: </p>
                        <ProductQuantity
                            quantity={quantity}
                            setQuantity={setQuantity}
                        />
                    </div>

                    <div className="flex items-center justify-between gap-x-5">
                        <Button className="flex-1">
                            <ShoppingBag />
                            Add to cart
                        </Button>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline">
                                    <Heart />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Add to Wishlist</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </section>
            {/* related products  */}
            <RelatedProducts />
        </Container>
    );
}
