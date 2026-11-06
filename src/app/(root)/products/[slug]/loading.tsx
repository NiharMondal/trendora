import ProductDetailsSkeleton from "@/features/products/components/product-details/product-details-skeleton";

// Overrides the storefront's grid-shaped loading.tsx for this route, so
// clicking a product shows a product-shaped placeholder, not a catalogue.
export default function ProductDetailsLoading() {
    return <ProductDetailsSkeleton />;
}
