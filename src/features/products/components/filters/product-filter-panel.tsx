"use client";

import { RotateCcw } from "lucide-react";

import { TProductFiltersState } from "@/features/products/hooks/use-product-filters";
import { TProductFacets } from "@/features/products/types/product-filter.types";
import { Checkbox } from "@/shared/ui/checkbox";
import { Skeleton } from "@/shared/ui/skeleton";

import FacetSection from "./facet-section";
import PriceFilter from "./price-filter";
import RatingFilter from "./rating-filter";

type ProductFilterPanelProps = {
    facets?: TProductFacets;
    isLoading: boolean;
    filters: TProductFiltersState;
    /** Off inside the mobile sheet, whose own header already says "Filters". */
    showHeading?: boolean;
};

const GENDER_LABELS: Record<string, string> = {
    MEN: "Men",
    WOMEN: "Women",
    KIDS: "Kids",
    UNISEX: "Unisex",
};

/**
 * The whole filter panel. Rendered twice — as the desktop sidebar and inside
 * the mobile sheet — from this one component, so the two can never drift.
 *
 * Every section is driven by `GET /products/filters`: nothing here knows what
 * a category or a brand is called. That is what lets a vendor open a new
 * category and have it appear in the panel without a frontend change.
 */
export default function ProductFilterPanel({
    facets,
    isLoading,
    filters,
    showHeading = true,
}: ProductFilterPanelProps) {
    if (isLoading && !facets) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                        <Skeleton className="h-3 w-4/6" />
                    </div>
                ))}
            </div>
        );
    }

    if (!facets) return null;

    const { columnFilters, isSelected, toggleValue, setFilter, setPriceRange } =
        filters;

    return (
        <div className="space-y-1">
            {(showHeading || filters.isFiltered) && (
                <div className="flex items-center justify-between pb-2">
                    {showHeading && <p className="font-semibold">Filters</p>}

                    {filters.isFiltered && (
                        <button
                            type="button"
                            onClick={filters.handleResetFilters}
                            className="ml-auto flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                        >
                            <RotateCcw className="size-3" />
                            Clear all
                        </button>
                    )}
                </div>
            )}

            <FacetSection
                title="Category"
                options={facets.categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                    count: category.count,
                }))}
                isSelected={(value) => isSelected("categoryId", value)}
                onToggle={(value) => toggleValue("categoryId", value)}
            />

            <PriceFilter
                bounds={facets.price}
                min={columnFilters.minPrice}
                max={columnFilters.maxPrice}
                onApply={setPriceRange}
            />

            <FacetSection
                title="Brand"
                options={facets.brands.map((brand) => ({
                    value: brand.id,
                    label: brand.name,
                    count: brand.count,
                }))}
                isSelected={(value) => isSelected("brandId", value)}
                onToggle={(value) => toggleValue("brandId", value)}
            />

            <FacetSection
                title="Size"
                options={facets.sizes.map((size) => ({
                    value: size.id,
                    label: size.name,
                    count: size.count,
                    group: size.sizeGroup,
                }))}
                isSelected={(value) => isSelected("sizeId", value)}
                onToggle={(value) => toggleValue("sizeId", value)}
                visibleCount={8}
            />

            <FacetSection
                title="Gender"
                options={facets.genders.map((gender) => ({
                    value: gender.value,
                    label: GENDER_LABELS[gender.value] ?? gender.value,
                    count: gender.count,
                }))}
                isSelected={(value) => isSelected("gender", value)}
                onToggle={(value) => toggleValue("gender", value)}
            />

            {/* Many sellers, so "who am I buying from" is a real filter here in
                a way it is not on a single-vendor shop. */}
            <FacetSection
                title="Store"
                options={facets.stores.map((store) => ({
                    value: store.id,
                    label: store.storeName,
                    count: store.count,
                }))}
                isSelected={(value) => isSelected("vendorId", value)}
                onToggle={(value) => toggleValue("vendorId", value)}
            />

            <RatingFilter
                options={facets.ratings}
                value={columnFilters.minRating}
                onChange={(value) => setFilter("minRating", value)}
            />

            <label
                htmlFor="filter-in-stock"
                className="flex cursor-pointer items-center gap-2 py-3 text-sm text-muted-foreground hover:text-foreground"
            >
                <Checkbox
                    id="filter-in-stock"
                    checked={columnFilters.inStock === "true"}
                    onCheckedChange={(checked) =>
                        setFilter("inStock", checked ? "true" : "")
                    }
                />
                In stock only
            </label>
        </div>
    );
}
