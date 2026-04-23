"use client";
import Container from "@/components/common/shared/container";
import { useAppSelector } from "@/redux/redux.hooks";
import { selectCartItems } from "@/redux/slice/cartSlice";
import Link from "next/link";
import OrderSummary from "./order-summary";
import ProductSection from "./product-section";

export default function CartComponent() {
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
        <div className="py-10">
            <Container className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <ProductSection />
                <OrderSummary />
            </Container>
        </div>
    );
}
