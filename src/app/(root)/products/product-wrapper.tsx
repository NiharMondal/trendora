"use client";
import Container from "@/components/common/container";
import SpinnerLoading from "@/components/common/spinner-loading";
import ProductCard from "@/components/common/product-card/product-card";
import { useAllProductsQuery } from "@/redux/api/productApi";
import React from "react";

export default function ProductWrapper() {
    const { data, isLoading } = useAllProductsQuery({});
    return (
        <Container className="space-y-5">
            <div>Filter section</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {data?.result?.map((product) => (
                    <ProductCard product={product} key={product.id} />
                ))}
            </div>
        </Container>
    );
}
