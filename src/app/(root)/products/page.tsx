import { Suspense } from "react";

import ProductWrapper from "@/features/products/components/product-wrapper";
import ProductGridSkeleton from "@/features/products/components/product-grid-skeleton";
import Container from "@/shared/components/container";

/**
 * `ProductWrapper` keeps its filter state in the URL via `useSearchParams`,
 * which Next 15 requires to sit under a Suspense boundary — without one the
 * whole route opts out of static rendering at build time.
 */
export default function ProductPage() {
	return (
		<Suspense
			fallback={
				<Container className="py-6">
					<ProductGridSkeleton />
				</Container>
			}
		>
			<ProductWrapper />
		</Suspense>
	);
}
