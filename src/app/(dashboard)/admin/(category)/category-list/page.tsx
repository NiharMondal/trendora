import CategoryTable from "@/components/@dashboard/admin/category-table/category-table";
import Headline from "@/shared/components/headline";

export default function CategoryList() {
    return (
        <div className="space-y-5">
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
