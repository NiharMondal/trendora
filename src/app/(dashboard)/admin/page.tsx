import NewComments from "@/features/analytics/components/new-comments";
import MarketplaceOverview from "@/features/analytics/components/marketplace-overview";
import RecentOrdersTable from "@/features/analytics/components/recent-orders/recent-orders-table";
import ProductsOverview from "@/features/analytics/components/products-overview";
import TopProducts from "@/features/analytics/components/top-products";
import OrderChart from "@/features/analytics/components/order-chart";

export default function AdminHomePage() {
    return (
        <div className="space-y-5">
            {/* Real marketplace figures. The four tiles here used to be
                hardcoded "Total Sales 1234" placeholders. */}
            <MarketplaceOverview />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Recent Orders  */}
                <OrderChart />

                {/* top products  */}
                <TopProducts />

                <ProductsOverview />

                <RecentOrdersTable />
                <NewComments />
            </div>
        </div>
    );
}
