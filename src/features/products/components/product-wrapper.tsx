"use client";

import { PackageSearch, TriangleAlert } from "lucide-react";
import { useState } from "react";

import {
    useAllProductsQuery,
    useProductFiltersQuery,
} from "@/features/products/api/product.api";
import ActiveFilters from "@/features/products/components/filters/active-filters";
import ProductFilterPanel from "@/features/products/components/filters/product-filter-panel";
import ProductCard from "@/features/products/components/product-card/product-card";
import ProductGridSkeleton from "@/features/products/components/product-grid-skeleton";
import ProductToolbar from "@/features/products/components/product-toolbar";
import { useProductFilters } from "@/features/products/hooks/use-product-filters";
import Container from "@/shared/components/container";
import NoDataFound from "@/shared/components/no-data-found";
import { Pagination } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import TDSheet from "@/shared/components/td-sheet";

/**
 * The catalogue page: facet panel, search, sort and pagination over
 * `GET /products`.
 *
 * Both queries take the SAME `queryParams`, which is what keeps the counts in
 * the panel honest — they are computed from the shopper's current selection,
 * not from the whole catalogue. Filter state lives in the URL
 * (`useProductFilters`), so a filtered view is a shareable link and the back
 * button walks back through the shopper's choices.
 */
export default function ProductWrapper() {
    const filters = useProductFilters();
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    const query = filters.queryParams as Record<string, string>;

    const { data, isLoading, isFetching, isError, refetch } =
        useAllProductsQuery(query);
    const { data: facetData, isFetching: isFacetsFetching } =
        useProductFiltersQuery(query);

    const products = data?.result ?? [];
    const meta = data?.meta;
    const facets = facetData?.result;

    const panel = (showHeading: boolean) => (
        <ProductFilterPanel
            facets={facets}
            isLoading={isFacetsFetching}
            filters={filters}
            showHeading={showHeading}
        />
    );

    return (
        <Container className="space-y-6 py-6">
            <div>
                <h2 className="text-2xl font-semibold">All products</h2>
                <p className="text-sm text-muted-foreground">
                    Everything on sale across every store on Trendora.
                </p>
            </div>

            <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
                {/* Sticky so a long grid can be scrolled without losing the
                    filters; hidden below lg, where the sheet takes over. */}
                <aside className="hidden lg:block">
                    <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-2">
                        {panel(true)}
                    </div>
                </aside>

                <div className="space-y-5">
                    <ProductToolbar
                        filters={filters}
                        totalProducts={facets?.totalProducts ?? meta?.totalData}
                        isFetching={isFetching}
                        onOpenFilters={() => setIsFilterSheetOpen(true)}
                    />

                    <ActiveFilters facets={facets} filters={filters} />

                    {isError ? (
                        <NoDataFound
                            icon={TriangleAlert}
                            title="Could not load products"
                            description="Something went wrong reaching the store. Check your connection and try again."
                            actionLabel="Retry"
                            onAction={() => refetch()}
                        />
                    ) : isLoading ? (
                        <ProductGridSkeleton count={Number(filters.limit)} />
                    ) : products.length === 0 ? (
                        <NoDataFound
                            icon={PackageSearch}
                            title="No products match these filters"
                            description="Try widening the price range or clearing a filter or two."
                            {...(filters.isFiltered && {
                                actionLabel: "Clear all filters",
                                onAction: filters.handleResetFilters,
                            })}
                        />
                    ) : (
                        <div
                            className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4"
                            // Refetching keeps the old grid in place and dims
                            // it, rather than swapping to a skeleton — the
                            // shopper keeps their scroll position while a
                            // filter applies.
                            aria-busy={isFetching}
                        >
                            {products.map((product) => (
                                <ProductCard
                                    product={product}
                                    key={product.id}
                                />
                            ))}
                        </div>
                    )}

                    {meta && meta.totalPages > 1 && (
                        <Pagination
                            currentPage={meta.currentPage}
                            totalPages={meta.totalPages}
                            hasNextPage={meta.hasNextPage}
                            hasPreviousPage={meta.hasPreviousPage}
                            totalData={meta.totalData}
                            limit={Number(filters.limit)}
                            onPageChange={filters.setCurrentPage}
                        />
                    )}
                </div>
            </div>

            {/* Same panel component as the sidebar, so the two cannot drift. */}
            <TDSheet
                isOpen={isFilterSheetOpen}
                setIsOpen={setIsFilterSheetOpen}
                title="Filters"
                className="lg:hidden"
            >
                <div className="pb-4">{panel(false)}</div>

                <TDButton
                    className="w-full"
                    onClick={() => setIsFilterSheetOpen(false)}
                >
                    Show {facets?.totalProducts ?? 0} results
                </TDButton>
            </TDSheet>
        </Container>
    );
}
