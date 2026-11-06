"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import ProductPrice from "@/features/products/components/product-card/product-price";
import TDButton from "@/shared/components/td-button";
import { TWishlist } from "@/features/wishlist/types/wishlist.types";
import { Button } from "@/shared/ui/button";
import { useAppDispatch } from "@/store/redux.hooks";
import { addItemToCart } from "@/features/cart/store/cart.slice";
import { toCartItem } from "@/features/cart/utils/to-cart-item";

type Props = {
    item: TWishlist;
    onRemove: (item: TWishlist) => void;
    isRemoving?: boolean;
};

export default function WishlistCard({ item, onRemove, isRemoving }: Props) {
    const dispatch = useAppDispatch();
    const { product } = item;

    const mainImage =
        product?.images?.find((img) => img.isMain)?.url ??
        product?.images?.[0]?.url;

    // A product with variants is bought by size/colour; send the shopper to
    // pick one rather than adding a line the backend will refuse.
    const needsOption = (product?.variants?.length ?? 0) > 0;
    const isSoldOut = (product?.stockQuantity ?? 0) <= 0;

    const handleAddToCart = () => {
        dispatch(
            addItemToCart(toCartItem(product, { productImage: mainImage })),
        );
        toast.success("Product added to cart");
    };

    return (
        <div className="rounded-md group space-y-2 bg-white p-3">
            <div className="relative h-[280px] overflow-hidden rounded">
                <Link href={`/products/${product?.slug}`}>
                    {mainImage && (
                        <Image
                            src={mainImage}
                            alt={product?.name ?? "Product"}
                            height={300}
                            width={200}
                            className="w-full h-full object-cover object-center rounded aspect-auto"
                            loading="lazy"
                        />
                    )}
                </Link>

                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => onRemove(item)}
                    disabled={isRemoving}
                    aria-label="Remove from wishlist"
                >
                    <Trash2 />
                </Button>
            </div>

            <div className="space-y-2">
                <Link
                    href={`/products/${product?.slug}`}
                    className="text-sm tracking-wide hover:underline font-semibold line-clamp-1"
                >
                    {product?.name}
                </Link>
                <ProductPrice
                    basePrice={product?.basePrice ?? ""}
                    discountPrice={product?.discountPrice}
                />
                {needsOption && !isSoldOut ? (
                    <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-full"
                    >
                        <Link href={`/products/${product?.slug}`}>
                            <ShoppingBag />
                            Choose options
                        </Link>
                    </Button>
                ) : (
                    <TDButton
                        variant="outline"
                        className="w-full rounded-full"
                        onClick={handleAddToCart}
                        disabled={isSoldOut}
                    >
                        <ShoppingBag />
                        {isSoldOut ? "Sold out" : "Add to cart"}
                    </TDButton>
                )}
            </div>
        </div>
    );
}
