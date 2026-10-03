import { Metadata } from "next";

import PaymentCancel from "@/features/checkout/components/payment-cancel";

export const metadata: Metadata = {
    title: "Trendora | Payment Cancelled",
};

export default async function PaymentCancelPage({
    searchParams,
}: {
    searchParams: Promise<{ order?: string }>;
}) {
    const { order } = await searchParams;

    return <PaymentCancel orderNumber={order} />;
}
