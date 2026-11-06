import Headline from "@/shared/components/headline";

import FeaturedProductsTable from "@/features/products/components/featured/featured-products-table";

export default function FeaturedProductPage() {
    return (
        <div className="space-y-5">
            <Headline title="Featured Products" showBackButton />

            <FeaturedProductsTable />
        </div>
    );
}
