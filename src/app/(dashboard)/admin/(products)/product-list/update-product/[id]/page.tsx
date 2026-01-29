import Headline from "@/components/common/dashboard/headline";
import { use } from "react";
import UpdateProductForm from "./update-product";

export default function UpdateProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    return (
        <div className="space-y-4">
            <Headline title="Update Product" showBackButton />

            <UpdateProductForm productId={id} />
        </div>
    );
}
