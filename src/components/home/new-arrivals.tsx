import React from "react";
import Container from "../common/container";

import ProductCard from "../common/product-card/product-card";
import SectionHeader from "../common/section-header";
import { envConfig } from "@/config/env-config";
import { TProduct } from "@/types/product.types";

const newArrivals = async () => {
    try {
        const res = await fetch(
            `${envConfig.backend_url}/products/new-arrival`,
            { next: { revalidate: 3000 } }
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("Failed to fetch new arrival products", error);
    }
};
export default async function NewArrivals() {
    const products = await newArrivals();

    return (
        <div className="py-10">
            <Container className="space-y-5">
                <SectionHeader title="New Arrivals" />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {products?.result?.map((product: TProduct) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </Container>
        </div>
    );
}
