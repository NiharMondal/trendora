import CategoryTable from "@/components/@dashboard/admin/category-table/category-table";
import Headline from "@/components/common/dashboard/headline";

export default function CategoryList() {
    return (
        <div className="space-y-4">
            <Headline
                title="Category List"
                showBackButton
                href="/admin/add-category"
                buttonText="Add Category"
            />
            <CategoryTable />
        </div>
    );
}
