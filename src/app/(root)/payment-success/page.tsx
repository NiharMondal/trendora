import { Metadata } from "next";

import PaymentSuccess from "@/features/checkout/components/payment-success";

export const metadata: Metadata = {
    title: "Trendora | Payment Successful",
};

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ order?: string }>;
}) {
    const { order } = await searchParams;

    return <PaymentSuccess orderNumber={order} />;
}
