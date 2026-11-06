import { Metadata } from "next";

import VendorStoreReviews from "@/features/vendors/components/vendor-store-reviews";

export const metadata: Metadata = {
    title: "Trendora | Store Reviews",
};

export default function VendorReviewsPage() {
    return <VendorStoreReviews />;
}
