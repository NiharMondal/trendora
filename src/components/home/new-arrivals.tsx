import React from "react";
import Container from "../common/container";

import ProductCard from "../common/product-card";
import SectionHeader from "../common/section-header";

export default function NewArrivals() {
	return (
		<div className="py-10">
			<Container className="space-y-5">
				<SectionHeader title="New Arrivals" />

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
					<ProductCard />
					<ProductCard />
					<ProductCard />
					<ProductCard />
					<ProductCard />
					<ProductCard />
					<ProductCard />
					<ProductCard />
				</div>
			</Container>
		</div>
	);
}
