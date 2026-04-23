"use client";

import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/common/shared/container";
import ProductQuantity from "@/components/common/shared/product-quantity";
import TDButton from "@/components/common/shared/td-button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { productsImage } from "@/helping-data/image";
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
        <div className="col-span-full lg:col-span-2">
            <Table>
                <TableBody>
                    {cartItems.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 md:gap-4">
                                <div className="flex items-center gap-x-4">
                                    <Image
                                        src={
                                            item.productImage ||
                                            productsImage.black
                                        }
                                        width={100}
                                        height={70}
                                        alt="Image"
                                        className="size-[45px] sm:size-[50px] md:size-[60px] rounded overflow-hidden hover:object-bottom object-top object-cover duration-200"
                                    />
                                    <div className="sm:space-y-0.5">
                                        <p className="text-nowrap flex items-center gap-x-2 text-xs sm:text-base">
                                            {item.productName}
                                            {item.variantId ? (
                                                <small className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-medium italic">
                                                    Variant
                                                </small>
                                            ) : (
                                                <small className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs font-medium italic">
                                                    Normal
                                                </small>
                                            )}
                                        </p>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            ${item.price.toFixed(2)} x{" "}
                                            {item.quantity}
                                        </p>
                                    </div>
                                </div>
                                <div className="sm:hidden">
                                    <ProductQuantity
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
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="hidden sm:block">
                                    <ProductQuantity
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
                                </div>
                            </TableCell>

                            <TableCell>
                                ${(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell></TableCell>

                            <TableCell>
                                <TDButton
                                    className="bg-none text-destructive hover:bg-destructive"
                                    variant="ghost"
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
