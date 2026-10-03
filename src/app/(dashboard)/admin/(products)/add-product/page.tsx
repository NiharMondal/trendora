import Headline from "@/shared/components/headline";

import CreateProduct from "@/features/products/components/create-product";

export default function AddProduct() {
    return (
        <div className="space-y-5">
            <Headline title="Add Product" showBackButton />

            <CreateProduct />
        </div>
    );
}
