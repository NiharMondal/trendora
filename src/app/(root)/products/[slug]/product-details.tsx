"use client";
import ProductPrice from "@/components/common/product-card/product-price";
import ProductQuantity from "@/components/common/product-quantity";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TProduct } from "@/types/product.types";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Heart, RefreshCw, ShoppingBag } from "lucide-react";
import { useState } from "react";
import DeliveryDetails from "./delivery-details";

type Props = {
    product: TProduct | undefined;
};
export default function ProductDetails({ product }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState("");

    const addToCart = () => {};
    return (
        <div className="space-y-5 bg-background">
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
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                    {product?.variants?.map((variant) => (
                        <div
                            onClick={() => setSelectedVariant(variant.id)}
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
                <Button className="flex-1" onClick={() => addToCart()}>
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
            {/** Delivery Details */}
            <DeliveryDetails />
        </div>
    );
}
