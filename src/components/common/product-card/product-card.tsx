import React from "react";
import { Button } from "../../ui/button";
import Link from "next/link";
import CardUtility from "./card-utility";
import { TProduct } from "@/types/product.types";
import { cn } from "@/lib/utils";
import Price from "./product-price";

type Props = {
    product: TProduct;
};

export default function ProductCard({ product }: Props) {
    const isMainPhoto = product?.images?.find((img) => img?.isMain);

    return (
        <div className="rounded-md group space-y-2">
            <div className="relative h-[330px] overflow-hidden">
                <CardUtility product={product} />

                <Link href={`/products/${product.slug}`}>
                    {product?.images?.length && (
                        <img
                            src={isMainPhoto?.url || product.images[0].url}
                            alt="image"
                            height={300}
                            width={200}
                            className="w-full h-full object-cover object-center rounded aspect-auto"
                        />
                    )}
                </Link>

                <div className="absolute -bottom-10 opacity-0 left-0 right-0 group-hover:bottom-2 duration-200 group-hover:opacity-100 px-5">
                    <Button
                        className="w-full cursor-pointer  rounded-full"
                        variant={"outline"}
                    >
                        Quick Add
                    </Button>
                </div>
            </div>
            <div className="p-0">
                <Link
                    href={`/products/${product.slug}`}
                    className="text-sm tracking-wide hover:underline font-semibold"
                >
                    {product.name}
                </Link>
                <Price
                    basePrice={product.basePrice}
                    discountPrice={product.discountPrice}
                />
            </div>
        </div>
    );
}
