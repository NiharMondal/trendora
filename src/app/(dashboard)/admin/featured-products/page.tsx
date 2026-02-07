import Headline from "@/components/common/dashboard/headline";
import FeaturedTable from "./featured-table";

export default function FeaturedProductPage() {
    return (
        <div className="space-y-5">
            <Headline title="Featured Products" showBackButton />

            <FeaturedTable />
        </div>
    );
}
