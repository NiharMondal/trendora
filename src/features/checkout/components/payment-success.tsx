"use client";

import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { clearCart } from "@/features/cart/store/cart.slice";
import Container from "@/shared/components/container";
import { Button } from "@/shared/ui/button";
import { useAppDispatch } from "@/store/redux.hooks";

type PaymentSuccessProps = {
    orderNumber?: string;
};

export default function PaymentSuccess({ orderNumber }: PaymentSuccessProps) {
    const dispatch = useAppDispatch();

    // Stripe only redirects here after the charge went through, so this is the
    // first safe point to empty the cart.
    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);

    return (
        <Container className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10">
            <div className="bg-white border border-muted rounded-md p-8 max-w-xl w-full text-center space-y-5">
                <CircleCheckBig
                    className="size-16 text-success-600 mx-auto"
                    strokeWidth={1.5}
                />
                <div className="space-y-2">
                    <h3>Payment successful</h3>
                    <p className="font-inter text-muted-foreground">
                        Thank you for your purchase. We have received your
                        payment and your order is being prepared.
                    </p>
                </div>

                {orderNumber && (
                    <p className="font-inter">
                        Order number:{" "}
                        <span className="font-medium">{orderNumber}</span>
                    </p>
                )}

                <p className="font-inter text-sm text-muted-foreground">
                    Your order is confirmed by our payment provider a few
                    moments after the charge, so it may take a short while to
                    appear in your order history.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link href="/dashboard/my-orders">
                        <Button>View my orders</Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="outline">Continue shopping</Button>
                    </Link>
                </div>
            </div>
        </Container>
    );
}
