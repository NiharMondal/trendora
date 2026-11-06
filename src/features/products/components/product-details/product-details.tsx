import ProductCommonDetails from "@/features/products/components/product-common-details";
import { TProduct } from "@/features/products/types/product.types";

import DeliveryDetails from "./delivery-details";

type Props = {
	product: TProduct | undefined;
};
export default function ProductDetails({ product }: Props) {
	return (
		<div className="space-y-8">
			<ProductCommonDetails product={product} />
			<DeliveryDetails vendor={product?.vendor} />
		</div>
	);
}
