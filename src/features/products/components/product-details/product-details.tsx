import ProductCommonDetails from "@/features/products/components/product-common-details";
import { TProduct } from "@/features/products/types/product.types";

import DeliveryDetails from "./delivery-details";

type Props = {
	product: TProduct | undefined;
	/** Staff preview — see ProductCommonDetails. */
	preview?: boolean;
};
export default function ProductDetails({ product, preview = false }: Props) {
	return (
		<div className="space-y-8">
			<ProductCommonDetails product={product} preview={preview} />
			{/* Shopper-facing terms; staff already see the store in the facts strip. */}
			{!preview && <DeliveryDetails vendor={product?.vendor} />}
		</div>
	);
}
