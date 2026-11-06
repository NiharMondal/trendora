import { Metadata } from "next";

import MyRefundsList from "@/features/refunds/components/my-refunds-list";

export const metadata: Metadata = {
    title: "Trendora | My Refunds",
};

export default function MyRefundsPage() {
    return <MyRefundsList />;
}
