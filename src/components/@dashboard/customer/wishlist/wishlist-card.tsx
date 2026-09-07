"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import ProductPrice from "@/components/common/product-card/product-price";
import TDButton from "@/shared/components/td-button";
import { TCartItem } from "@/components/types/cart.types";
import { TWishlist } from "@/components/types/wishlist.types";
import { Button } from "@/shared/ui/button";
import { useAppDispatch } from "@/redux/redux.hooks";
import { addItemToCart } from "@/redux/slice/cartSlice";

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

    const productPrice = product?.discountPrice
        ? product.discountPrice
        : product?.basePrice;

    const handleAddToCart = () => {
        const productData: TCartItem = {
            productId: product?.id ?? "",
            productName: product?.name ?? "",
            productImage: mainImage,
            quantity: 1,
            price: Number(productPrice),
        };

        dispatch(addItemToCart(productData));
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
                <TDButton
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={handleAddToCart}
                >
                    <ShoppingBag />
                    Add to cart
                </TDButton>
            </div>
        </div>
    );
}
