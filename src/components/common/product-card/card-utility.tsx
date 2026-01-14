import React, { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../ui/tooltip";
import { Eye, Heart, RefreshCw, ShoppingBag } from "lucide-react";
import { TProduct } from "@/types/product.types";
import TDSheet from "../td-sheet";
import Price from "./product-price";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProductQuantity from "../product-quantity";

type Props = {
    product: TProduct;
};
export default function CardUtility({ product }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className="absolute right-0 top-0 overflow-hidden">
                <div className="flex flex-col gap-y-2 pr-3 pt-3 translate-x-12 group-hover:translate-x-0 duration-300 ">
                    <Tooltip>
                        <TooltipTrigger className="bg-neutral-light size-8 rounded-full flex items-center justify-center text-neutral-dark/80">
                            <Heart />
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Add to Wishlist</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger
                            className="bg-neutral-light size-8 rounded-full flex items-center justify-center text-neutral-dark/80"
                            onClick={() => setIsOpen(true)}
                        >
                            <Eye />
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Quick View</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <TDSheet
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Quick View"
                className="md:min-w-3xl"
            >
                <QuickViewDetails product={product} />
            </TDSheet>
        </>
    );
}

const QuickViewDetails = ({ product }: Props) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState("");
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/** image section */}
            <div className="lg:grid-cols-1 flex flex-row lg:flex-col  items-center justify-between gap-5 overflow-x-auto">
                {product.images?.map((img) => (
                    <img
                        src={img.url}
                        alt={product.name}
                        className="w-full h-[320px] rounded-lg overflow-hidden"
                        key={img.id}
                    />
                ))}
            </div>

            {/** details section */}
            <div className="space-y-5 lg:col-span-2">
                <h2>{product.name}</h2>
                <p>Rating section</p>
                <Price
                    basePrice={product.basePrice}
                    discountPrice={product.discountPrice}
                />
                <p>{product.description}</p>
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
                            <TooltipContent side="left">
                                <p>Reset Variant</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 gap-3">
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
                    <Button className="flex-1">
                        <ShoppingBag />
                        Add to cart
                    </Button>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" className="">
                                <Heart />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Add to Wishlist</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
