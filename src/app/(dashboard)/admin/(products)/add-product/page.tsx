import Headline from "@/components/common/dashboard/headline";
import CreateProduct from "./create-product";

export default function AddProduct() {
    return (
        <div className="space-y-5">
            <Headline title="Add Product" showBackButton />

            <CreateProduct />
        </div>
    );
}
