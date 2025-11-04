"use client";
import React, { use } from "react";

import GeneralInfo from "./general-info";

export default function UpdateProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);

	return (
		<div className="space-y-4">
			<h4>Update Product</h4>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
				<GeneralInfo id={id} />
			</div>
		</div>
	);
}
