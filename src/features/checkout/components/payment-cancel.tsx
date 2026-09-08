"use client";

import { CircleX } from "lucide-react";
import Link from "next/link";

import Container from "@/shared/components/container";
import { Button } from "@/shared/ui/button";

type PaymentCancelProps = {
    orderNumber?: string;
};

export default function PaymentCancel({ orderNumber }: PaymentCancelProps) {
    return (
        <Container className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10">
            <div className="bg-white border border-muted rounded-md p-8 max-w-xl w-full text-center space-y-5">
                <CircleX
                    className="size-16 text-destructive mx-auto"
                    strokeWidth={1.5}
                />
                <div className="space-y-2">
                    <h3>Payment cancelled</h3>
                    <p className="font-inter text-muted-foreground">
                        You cancelled the payment, so nothing was charged and no
                        order was placed. Your cart is still intact.
                    </p>
                </div>

                {orderNumber && (
                    <p className="font-inter">
                        Cancelled order number:{" "}
                        <span className="font-medium">{orderNumber}</span>
                    </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link href="/checkout">
                        <Button>Back to checkout</Button>
                    </Link>
                    <Link href="/cart">
                        <Button variant="outline">View cart</Button>
                    </Link>
                </div>
            </div>
        </Container>
    );
}
