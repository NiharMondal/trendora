import Headline from "@/components/common/dashboard/headline";
import AddCategory from "./add-category";

export default function AddCategoryPage() {
    return (
        <div className="space-y-5">
            <Headline title="Add new Category" showBackButton/>
            <AddCategory />
        </div>
    );
}
