import React from "react";
import Container from "../common/container";
import SectionHeader from "../common/section-header";
import ProductCard from "../common/product-card/product-card";

export default function FeaturedProduct() {
    return (
        <div className="py-10">
            <Container className="space-y-10">
                <SectionHeader title="Featured on Trendora" />

                <div className="grid grid-cols-2 md:grid-cols-3  gap-8">
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </div>
            </Container>
        </div>
    );
}
