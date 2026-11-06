"use client";
import { use } from "react";

import ProductDetailsView from "@/features/products/components/product-details/product-details-view";

export default function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    return <ProductDetailsView slug={slug} />;
}
