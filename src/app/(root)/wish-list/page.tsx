import Container from "@/components/common/container";
import ProductCard from "@/components/product-card/product-card";
import { products } from "@/helping-data/products";
import React from "react";

export default function WishList() {
	return (
		<section>
			<Container>
				<h1 className="uppercase text-2xl mb-3"> wish list </h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
					{products.map((item) => (
						<ProductCard key={item.name} product={item} />
					))}
				</div>
			</Container>
		</section>
	);
}
