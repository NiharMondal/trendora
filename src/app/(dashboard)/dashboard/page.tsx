import { Metadata } from "next";

import BuyerDashboard from "@/features/orders/components/buyer-dashboard";

export const metadata: Metadata = {
    title: "Trendora | My Dashboard",
};

export default function UserDashboardPage() {
    return <BuyerDashboard />;
}
