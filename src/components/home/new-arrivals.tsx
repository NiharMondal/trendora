import React from "react";
import Container from "../common/container";

import ProductCard from "../common/product-card";
import SectionHeader from "../common/section-header";
import { products } from "@/helping-data/products";

export default function NewArrivals() {
	return (
		<div className="py-10">
			<Container className="space-y-5">
				<SectionHeader title="New Arrivals" />

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
					{products.map((item) => (
						<ProductCard key={item.name} product={item} />
					))}
				</div>
			</Container>
		</div>
	);
}
