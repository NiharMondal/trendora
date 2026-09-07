import Headline from "@/shared/components/headline";

import AddCategory from "./add-category";

export default function AddCategoryPage() {
    return (
        <div className="space-y-5">
            <Headline title="Add new Category" showBackButton />
            <AddCategory />
        </div>
    );
}
