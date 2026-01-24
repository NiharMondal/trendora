"use client";
import Container from "@/components/common/container";
import ProductQuantity from "@/components/common/product-quantity";
import TDButton from "@/components/common/td-button";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { productsImage } from "@/helping-data/image";
import { useAppDispatch, useAppSelector } from "@/redux/redux.hooks";
import {
    decreaseQuantity,
    increaseQuantity,
    removeCartItem,
    selectCartItems,
    selectTotalAmount,
} from "@/redux/slice/cartSlice";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);
    const totalAmount = useAppSelector(selectTotalAmount);

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
        <div className="py-10">
            <Container className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                                                        <small className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-medium italic ">
                                                            Variant
                                                        </small>
                                                    ) : (
                                                        <small className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs font-medium italic ">
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
                                                            productId:
                                                                item.productId,
                                                            variantId:
                                                                item.variantId,
                                                        }),
                                                    )
                                                }
                                                onDecrease={() =>
                                                    dispatch(
                                                        decreaseQuantity({
                                                            productId:
                                                                item.productId,
                                                            variantId:
                                                                item.variantId,
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
                                                            productId:
                                                                item.productId,
                                                            variantId:
                                                                item.variantId,
                                                        }),
                                                    )
                                                }
                                                onDecrease={() =>
                                                    dispatch(
                                                        decreaseQuantity({
                                                            productId:
                                                                item.productId,
                                                            variantId:
                                                                item.variantId,
                                                        }),
                                                    )
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        $
                                        {(item.price * item.quantity).toFixed(
                                            2,
                                        )}
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        <TDButton
                                            className="bg-none text-destructive hover:bg-destructive"
                                            variant="ghost"
                                            onClick={() =>
                                                dispatch(
                                                    removeCartItem({
                                                        productId:
                                                            item.productId,
                                                        variantId:
                                                            item.variantId,
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
                <div className="col-span-full lg:col-span-1 space-y-2">
                    <h5 className="border-b-2 border-black uppercase text-sm tracking-wide pb-2">
                        Order Summary
                    </h5>
                    <ul className="flex items-center justify-between ">
                        <li className="text-sm font-medium">Subtotal</li>
                        <li>
                            <b>${totalAmount.toFixed(2)}</b>
                        </li>
                    </ul>

                    <Link href={"/checkout"}>
                        <Button className="w-full uppercase font-medium text-sm tracking-wider ">
                            Proceed to checkout
                        </Button>
                    </Link>
                </div>
            </Container>
        </div>
    );
}
