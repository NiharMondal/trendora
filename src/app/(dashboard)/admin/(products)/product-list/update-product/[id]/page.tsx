import React, { use } from "react";
import UpdateProductForm from "./update-product-form";

export default function UpdateProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);

	return (
		<div className="space-y-4">
			<h4>Update Product</h4>

			<UpdateProductForm productId={id} />
		</div>
	);
}
