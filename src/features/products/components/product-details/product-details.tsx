import ProductCommonDetails from "@/features/products/components/product-common-details";
import { TProduct } from "@/features/products/types/product.types";

import DeliveryDetails from "./delivery-details";

type Props = {
	product: TProduct | undefined;
};
export default function ProductDetails({ product }: Props) {
	return (
		<div className="space-y-5 bg-background">
			<ProductCommonDetails product={product} />
			{/** Delivery Details */}
			<DeliveryDetails />
		</div>
	);
}
