"use client";
import Container from "@/components/common/container";
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { productsImage } from "@/helping-data/image";
import Quantity from "@/components/common/product-quantity";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const invoices = [
    {
        name: "esdasdfasf",
        price: 123,
        quantity: 1,
        total: "Credit Card",
    },
    {
        name: "INV002",
        price: 234,
        quantity: 1,
        paymentMethod: "PayPal",
    },
];

export default function CartPage() {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="py-10">
            <Container className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="col-span-full lg:col-span-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>
                                    <div className="hidden sm:block">Price</div>
                                </TableHead>
                                <TableHead>
                                    <div className="hidden sm:block">
                                        Quantity
                                    </div>
                                </TableHead>
                                <TableHead className="text-right">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.name}>
                                    <TableCell className="flex gap-x-2 max-w-[450px]">
                                        <Image
                                            src={productsImage.black}
                                            width={100}
                                            height={70}
                                            alt="Image"
                                            className="w-[100px] h-[100px] hover:object-bottom object-top object-cover duration-200"
                                        />
                                        <div className="space-y-2">
                                            <p className="text-wrap">
                                                Lorem ipsum dolor sit amet
                                                consectetur adipisicing elit.
                                                Magnam sunt eos dolor ad
                                                repellat itaque architecto
                                                assumenda harum excepturi
                                                reiciendis.
                                            </p>
                                            <div className="block sm:hidden">
                                                <Quantity
                                                    quantity={quantity}
                                                    setQuantity={setQuantity}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="hidden sm:block">
                                            {invoice.price}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="hidden sm:block">
                                            <Quantity
                                                quantity={quantity}
                                                setQuantity={setQuantity}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {invoice.price * invoice.quantity}
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
                            <b>$533</b>
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
