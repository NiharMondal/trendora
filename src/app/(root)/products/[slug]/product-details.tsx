"use client";
import ProductCommonDetails from "@/components/common/@ui/product-common-details";
import { TProduct } from "@/types/product.types";
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
