"use client";

import { Heart, RefreshCw, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { ReactSmartRating } from "react-smart-rating";
import { toast } from "sonner";

import { TProduct, TProductVariant } from "@/features/products/types/product.types";
import { Button } from "@/shared/ui/button";
import { useWishlistToggle } from "@/features/wishlist/hooks/use-wishlist-toggle";
import { cn } from "@/shared/lib/utils";
import { useAppDispatch } from "@/store/redux.hooks";
import { addItemToCart } from "@/features/cart/store/cart.slice";
import StoreBadge from "@/features/vendors/components/store-badge";
import { toCartItem } from "@/features/cart/utils/to-cart-item";

import ProductPrice from "@/features/products/components/product-card/product-price";
import ProductQuantity from "@/shared/components/product-quantity";
import { getDiscountPercent } from "@/features/products/utils/discount-percent";

type Props = {
    product: TProduct | undefined;
    /** Rendered inside the card's Quick View sheet rather than on the page. */
    quickView?: boolean;
};

/**
 * The buy box — shared by the product page and the card's Quick View, so the
 * two cannot disagree about what gets added to the cart.
 */
export default function ProductCommonDetails({
    product,
    quickView = false,
}: Props) {
    const dispatch = useAppDispatch();
    const {
        isWishlisted,
        toggle: toggleWishlist,
        isLoading: isWishlistLoading,
    } = useWishlistToggle(product?.id ?? "");
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
    const handleAddToCart = (product: TProduct | undefined) => {
        dispatch(
            addItemToCart(
                toCartItem(product, {
                    quantity,
                    variantId: variantInfo?.id,
                    variantPrice: variantInfo?.price,
                }),
            ),
        );
        toast.success("Product added to cart");
    };

    const Title = quickView ? "h2" : "h1";
    const variants = product?.variants ?? [];
    const selectedVariant = variants.find((v) => v.id === variantInfo.id);
    const discountPercent = getDiscountPercent(
        product?.basePrice,
        product?.discountPrice,
    );

    return (
        <div className="space-y-6">
            {/* Heading */}
            <div className="space-y-3">
                {product?.brand?.name && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
                        {product.brand.name}
                    </p>
                )}
                <Title className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                    {product?.name}
                </Title>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {product?.averageRating && (
                        <div className="flex items-center gap-2 text-sm">
                            <ReactSmartRating
                                initialRating={product.averageRating}
                                activeColor="orange"
                                readOnly
                            />
                            <span className="font-medium">
                                {Number(product.averageRating).toFixed(1)}
                            </span>
                            {!!product.totalReviews && !quickView && (
                                <a
                                    href="#reviews"
                                    className="text-muted-foreground underline-offset-2 hover:underline"
                                >
                                    {product.totalReviews}{" "}
                                    {product.totalReviews === 1 ? "review" : "reviews"}
                                </a>
                            )}
                        </div>
                    )}
                    <StoreBadge vendor={product?.vendor} className="text-sm" />
                </div>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-3 text-2xl">
                <ProductPrice
                    basePrice={product?.basePrice || ""}
                    discountPrice={product?.discountPrice}
                />
                {discountPercent > 0 && (
                    <span className="rounded-full bg-destructive-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                        Save {discountPercent}%
                    </span>
                )}
            </div>

            {/* Variants */}
            {variants.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                            Select an option
                            {selectedVariant && (
                                <span className="ml-2 font-normal text-muted-foreground">
                                    {selectedVariant.size?.name} ·{" "}
                                    {selectedVariant.color} · ${selectedVariant.price}
                                </span>
                            )}
                        </p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleResetVariantInfo}
                            disabled={!variantInfo.id}
                            className="h-7 cursor-pointer gap-1 px-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-0"
                        >
                            <RefreshCw className="size-3" aria-hidden="true" />
                            Clear
                        </Button>
                    </div>
                    <div
                        className={cn(
                            "grid grid-cols-3 gap-2.5 sm:grid-cols-4",
                            { "lg:grid-cols-3 xl:grid-cols-4": !quickView },
                        )}
                    >
                        {variants.map((variant) => {
                            const isSelected = variant.id === variantInfo.id;
                            return (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleVariantInfo(variant)}
                                    key={variant.id}
                                    aria-pressed={isSelected}
                                    className={cn(
                                        "h-auto cursor-pointer flex-col items-start justify-start gap-0.5 whitespace-normal rounded-lg px-3 py-2.5 text-left shadow-none hover:border-foreground/40 hover:bg-background hover:text-foreground",
                                        isSelected &&
                                            "border-primary bg-primary-50 ring-1 ring-primary hover:border-primary hover:bg-primary-50",
                                    )}
                                >
                                    <span className="text-sm font-semibold">
                                        {variant.size?.name}
                                    </span>
                                    <span className="text-xs capitalize text-muted-foreground">
                                        {variant.color}
                                    </span>
                                    <span className="text-xs font-medium">
                                        ${variant.price}
                                    </span>
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Quantity + actions */}
            <div className="space-y-3">
                <p className="text-sm font-medium">Quantity</p>
                <div className="flex flex-wrap items-center gap-3">
                    <ProductQuantity
                        quantity={quantity}
                        onIncrease={() => setQuantity((q) => q + 1)}
                        onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="h-12 rounded-full px-3"
                    />
                    <Button
                        size="lg"
                        className="h-12 min-w-44 flex-1 cursor-pointer rounded-full text-base"
                        onClick={() => handleAddToCart(product)}
                    >
                        <ShoppingBag />
                        Add to cart
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-12 cursor-pointer rounded-full hover:bg-destructive/10"
                        onClick={toggleWishlist}
                        disabled={isWishlistLoading || !product?.id}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        aria-pressed={isWishlisted}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart
                            className={cn("size-5", {
                                "fill-destructive text-destructive": isWishlisted,
                            })}
                        />
                    </Button>
                </div>
            </div>

            {/* Description */}
            {product?.description && (
                <div className="space-y-2 border-t pt-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wider">
                        Description
                    </h2>
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                        {product.description}
                    </p>
                </div>
            )}
        </div>
    );
}
