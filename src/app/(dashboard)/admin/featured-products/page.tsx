import Headline from "@/shared/components/headline";

import FeaturedTable from "@/features/products/components/featured-table";

export default function FeaturedProductPage() {
    return (
        <div className="space-y-5">
            <Headline title="Featured Products" showBackButton />

            <FeaturedTable />
        </div>
    );
}
