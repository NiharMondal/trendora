"use client";

import { BadgeCheck, Eye, Layers, PackageX, Sparkles, Tag, Users } from "lucide-react";

import { useAllBrandQuery } from "@/features/brands/api/brand.api";
import { useAllCategoryQuery } from "@/features/categories/api/category.api";
import { productStatusMap } from "@/features/orders/constants/status-maps";
import { ToolbarFilter } from "@/shared/components/table";
import { productGenderOptions } from "@/shared/constants/mock-products";
import { useTableFilters } from "@/shared/hooks/use-table-filters";

/**
 * Filter state and toolbar config for the seller's catalogue
 * (`/vendor/products`) — the admin catalogue's set minus Store, since every
 * row is the caller's own.
 *
 * `/products/vendor/my-products` runs the same generic `filter()` as the
 * admin list, so the same limits apply: exact matches only (no "low stock"),
 * and `categoryId` matches that category, not its children.
 */
export function useVendorProductFilters() {
    const filters = useTableFilters({
        defaultSortBy: "createdAt:desc",
        defaultFilters: {
            status: "",
            isPublished: "",
            isFeatured: "",
            stockQuantity: "",
            categoryId: "",
            brandId: "",
            gender: "",
        },
    });

    // The whole taxonomy, not just what this store uses: the lists are small
    // and admin-owned, and there is no per-store facet endpoint.
    const { data: categories } = useAllCategoryQuery({ limit: "100" });
    const { data: brands } = useAllBrandQuery({ limit: "100" });

    const byLabel = (a: { label: string }, b: { label: string }) =>
        a.label.localeCompare(b.label);

    // What a seller triages by — "what's waiting on review" and "what's
    // switched off" — stays on the row; the rest is in the Filters panel.
    const toolbarFilters: ToolbarFilter[] = [
        {
            key: "status",
            label: "Review",
            icon: BadgeCheck,
            allLabel: "Any status",
            options: Object.entries(productStatusMap).map(
                ([value, { label }]) => ({ label, value }),
            ),
        },
        {
            key: "isPublished",
            label: "Live",
            icon: Eye,
            allLabel: "Any",
            options: [
                { label: "Live", value: "true" },
                { label: "Hidden", value: "false" },
            ],
        },
        {
            key: "stockQuantity",
            label: "Stock",
            icon: PackageX,
            placement: "advanced",
            options: [{ label: "Out of stock", value: "0" }],
        },
        {
            key: "isFeatured",
            label: "Featured by Trendora",
            icon: Sparkles,
            placement: "advanced",
            options: [
                { label: "Featured", value: "true" },
                { label: "Not featured", value: "false" },
            ],
        },
        {
            key: "gender",
            label: "Gender",
            icon: Users,
            placement: "advanced",
            options: productGenderOptions,
        },
        {
            key: "categoryId",
            label: "Category",
            icon: Layers,
            placement: "advanced",
            allLabel: "All categories",
            options: (categories?.result ?? [])
                .map((category) => ({ label: category.name, value: category.id }))
                .sort(byLabel),
        },
        {
            key: "brandId",
            label: "Brand",
            icon: Tag,
            placement: "advanced",
            allLabel: "All brands",
            options: (brands?.result ?? [])
                .map((brand) => ({ label: brand.name, value: brand.id }))
                .sort(byLabel),
        },
    ];

    return { filters, toolbarFilters };
}
