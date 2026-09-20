"use client";
import ProductCard from "@/features/products/components/product-card/product-card";
import Container from "@/shared/components/container";
import { useAllProductsQuery } from "@/features/products/api/product.api";

export default function ProductWrapper() {
	const { data, isLoading } = useAllProductsQuery({});

	return (
		<Container className="space-y-5">
			<div>Filter section</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
				{data?.result?.map((product) => (
					<ProductCard product={product} key={product.id} />
				))}
			</div>
		</Container>
	);
}
