"use client";

import ProductCard from "@/features/products/components/product-card/product-card";
import { useRecentlyViewedProducts } from "@/features/products/hooks/use-recently-viewed";
import SectionHeader from "@/shared/components/section-header";

/** How many cards fit the product page's closing row. */
const SHOWN = 4;

/**
 * The shopper's own trail, below a product. The product being viewed is left
 * out, and like the home rails this renders nothing until there is something
 * to show — a first visit, or storage that is blocked, gets no empty heading.
 */
export default function RecentlyViewed({ productId }: { productId: string }) {
    const { products } = useRecentlyViewedProducts(productId);

    if (products.length === 0) return null;

    return (
        <section className="mt-10 space-y-5" aria-label="Recently viewed">
            <SectionHeader title="Recently viewed" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.slice(0, SHOWN).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
