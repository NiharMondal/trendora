"use client";
import ProductPrice from "@/components/common/product-card/product-price";
import ProductQuantity from "@/components/common/product-quantity";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/redux/redux.hooks";
import { addItemToCart } from "@/redux/slice/cartSlice";
import { TProduct, TProductVariant } from "@/types/product.types";

import { Heart, RefreshCw, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
    product: TProduct | undefined;
    quickView?: boolean;
};
export default function ProductCommonDetails({
    product,
    quickView = false,
}: Props) {
    const tooltipSide = quickView ? "left" : "top";
    const dispatch = useAppDispatch();
    const [quantity, setQuantity] = useState(1);
    const [variantInfo, setVariantInfo] = useState<{
        id: null | string;
        price: null | string;
    }>({
        id: null,
        price: null,
    });
    const handleVariantInfo = (variant: TProductVariant) => {
        setVariantInfo({
            id: variant.id,
            price: variant.price,
        });
    };
    const handleResetVariantInfo = () => {
        setVariantInfo({ id: null, price: null });
    };
    const productPrice = product?.discountPrice
        ? product?.discountPrice
        : product?.basePrice;

    const handleAddToCart = (product: TProduct | undefined) => {
        const productData = {
            productId: product?.id ?? "",
            productName: product?.name ?? "",
            productImage: product?.images[0].url,
            variantId: variantInfo.id,
            quantity: quantity,
            price: Number(variantInfo.price) || Number(productPrice),
        };
        dispatch(addItemToCart(productData));
        toast.success("Product added to cart");
    };
    return (
        <>
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
                            onClick={handleResetVariantInfo}
                            className="border p-2 rounded-full hover:text-destructive"
                        >
                            <RefreshCw className="size-3 " />
                        </TooltipTrigger>
                        <TooltipContent side={tooltipSide}>
                            <p>Reset Variant</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div
                    className={cn(
                        "grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3",
                        {
                            "2xl:grid-cols-4": quickView,
                        }
                    )}
                >
                    {product?.variants?.map((variant) => (
                        <div
                            onClick={() => handleVariantInfo(variant)}
                            key={variant.id}
                            className={cn(
                                "cursor-pointer ring-1 ring-muted p-3 rounded-md text-sm font-light",
                                {
                                    "ring-2 ring-primary":
                                        variant?.id === variantInfo.id,
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
                    onIncrease={() => setQuantity((q) => q + 1)}
                    onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                />
            </div>

            <div className="flex items-center justify-between gap-x-5">
                <Button
                    className="flex-1"
                    onClick={() => handleAddToCart(product)}
                >
                    <ShoppingBag />
                    Add to cart
                </Button>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline">
                            <Heart />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side={tooltipSide}>
                        <p>Add to Wishlist</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </>
    );
}
