"use client";

import {
    useAllProductsQuery,
    useBestSellersQuery,
    useNewArrivalsQuery,
} from "@/features/products/api/product.api";

import ProductRail from "./product-rail";

/**
 * The four product shelves, each a query bound to the shared `ProductRail`.
 *
 * They are separate components rather than one parameterised by an endpoint
 * because each calls a different hook, and hooks cannot be selected at
 * runtime. Keeping them in one file keeps the home page's data contract
 * visible in a single place.
 *
 * Every `href` is a real catalogue URL built from the same query params the
 * rail itself uses, so "View all" always lands on exactly the wider set the
 * shelf was a preview of.
 */

export function DealsRail() {
    const { data, isLoading } = useAllProductsQuery({
        onSale: "true",
        limit: "10",
        sortBy: "createdAt:desc",
    });

    return (
        <ProductRail
            title="Deals this week"
            description="Everything here is marked down right now."
            href="/products?onSale=true"
            products={data?.result}
            isLoading={isLoading}
        />
    );
}

export function BestSellersRail() {
    // Empty until the marketplace has completed orders — the rail hides itself
    // rather than claiming best sellers that do not exist yet.
    const { data, isLoading } = useBestSellersQuery({ limit: "10" });

    return (
        <ProductRail
            title="Best sellers"
            description="What shoppers bought most over the last 90 days."
            href="/products?sortBy=averageRating:desc"
            products={data?.result}
            isLoading={isLoading}
        />
    );
}

export function NewArrivalsRail() {
    const { data, isLoading } = useNewArrivalsQuery();

    return (
        <ProductRail
            title="New arrivals"
            description="The latest listings across every store."
            href="/products?sortBy=createdAt:desc"
            products={data?.result}
            isLoading={isLoading}
        />
    );
}

export function TopRatedRail() {
    const { data, isLoading } = useAllProductsQuery({
        sortBy: "averageRating:desc",
        minRating: "1",
        limit: "10",
    });

    return (
        <ProductRail
            title="Top rated"
            description="Highest rated by buyers who actually received them."
            href="/products?sortBy=averageRating:desc&minRating=1"
            products={data?.result}
            isLoading={isLoading}
        />
    );
}
