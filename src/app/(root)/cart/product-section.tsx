"use client";

import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/common/shared/container";
import ProductQuantity from "@/components/common/shared/product-quantity";
import TDButton from "@/components/common/shared/td-button";
import { useAppDispatch, useAppSelector } from "@/redux/redux.hooks";
import {
    decreaseQuantity,
    increaseQuantity,
    removeCartItem,
    selectCartItems,
} from "@/redux/slice/cartSlice";

export default function ProductSection() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);

    if (!cartItems.length) {
        return (
            <Container className="min-h-[calc(100vh-80px)] flex items-center justify-center ">
                <div className=" text-center space-y-3">
                    <h1>Your Cart is Empty</h1>
                    <p className="font-inter">Please visit product page</p>
                    <div className="mt-10"></div>
                    <Link
                        href={"/products"}
                        className="border  border-accent rounded px-4 py-2 hover:bg-accent hover:text-white duration-200"
                    >
                        Go Back
                    </Link>
                </div>
            </Container>
        );
    }
    return (
        <div className="col-span-full xl:col-span-2">
            <div className="space-y-8 bg-white p-5 rounded-md">
                {cartItems.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-border pt-4 first:border-none first:pt-0"
                    >
                        <div className="flex gap-3">
                            <div className="flex gap-2">
                                <Image
                                    src={item.productImage || ""}
                                    alt="Image"
                                    width={200}
                                    height={200}
                                    className="rounded-md  object-cover size-[50px]"
                                />
                                <div className="text-sm">
                                    <p className="">{item.productName}</p>
                                    <p className="flex items-center gap-x-2">
                                        ${item.price.toFixed(2)} x{" "}
                                        {item.quantity}
                                        {item?.variantId && (
                                            <span className="text-xs font-medium italic bg-blue-300/20 text-primary px-2 py-0.5 rounded-full">
                                                Variant
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <ProductQuantity
                                className="h-[30px] sm:h-auto px-2 max-w-[120px] sm:w-auto"
                                quantity={item.quantity}
                                onIncrease={() =>
                                    dispatch(
                                        increaseQuantity({
                                            productId: item.productId,
                                            variantId: item.variantId,
                                        }),
                                    )
                                }
                                onDecrease={() =>
                                    dispatch(
                                        decreaseQuantity({
                                            productId: item.productId,
                                            variantId: item.variantId,
                                        }),
                                    )
                                }
                            />

                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                            <TDButton
                                className="bg-none text-destructive hover:bg-destructive"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() =>
                                    dispatch(
                                        removeCartItem({
                                            productId: item.productId,
                                            variantId: item.variantId,
                                        }),
                                    )
                                }
                            >
                                <Trash />
                            </TDButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
