"use client";

import {
    BadgeCheck,
    Eye,
    Layers,
    PackageX,
    Star,
    Store,
    Tag,
    Users,
} from "lucide-react";

import { useAllBrandQuery } from "@/features/brands/api/brand.api";
import { useAllCategoryQuery } from "@/features/categories/api/category.api";
import { productStatusMap } from "@/features/orders/constants/status-maps";
import { useAllVendorsForAdminQuery } from "@/features/vendors/api/vendor.api";
import { ToolbarFilter } from "@/shared/components/table";
import { productGenderOptions } from "@/shared/constants/mock-products";
import { useTableFilters } from "@/shared/hooks/use-table-filters";

/**
 * Filter state and toolbar config for the admin product catalogue
 * (`/admin/product-list`), kept out of the table so the table only wires
 * things together.
 *
 * Every key is a plain Product column: `/products/admin/all` runs the
 * generic `filter()`, which turns an unknown key into an exact-match
 * `where`. So "low stock" cannot be offered without a backend change — only
 * "out of stock" (`stockQuantity=0`) is an equality. Likewise `categoryId`
 * matches that category only, not its children (unlike the storefront).
 */
export function useAdminProductFilters({
    featuredOnly = false,
}: {
    /**
     * The Products → Featured tab. `isFeatured=true` becomes the DEFAULT
     * rather than a filter, so it is always sent, Reset keeps it, it shows no
     * chip, and the Featured filter itself is not offered.
     */
    featuredOnly?: boolean;
} = {}) {
    const filters = useTableFilters({
        defaultSortBy: "createdAt:desc",
        defaultFilters: {
            status: "",
            isPublished: "",
            isFeatured: featuredOnly ? "true" : "",
            stockQuantity: "",
            vendorId: "",
            categoryId: "",
            brandId: "",
            gender: "",
        },
    });

    // 100 is the same ceiling the product form's pickers use.
    const { data: vendors } = useAllVendorsForAdminQuery({ limit: "100" });
    const { data: categories } = useAllCategoryQuery({ limit: "100" });
    const { data: brands } = useAllBrandQuery({ limit: "100" });

    const byLabel = (a: { label: string }, b: { label: string }) =>
        a.label.localeCompare(b.label);

    // The two most-used triage filters stay on the row; the rest live in the
    // collapsible "Filters" panel.
    const allFilters: ToolbarFilter[] = [
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
            key: "vendorId",
            label: "Store",
            icon: Store,
            allLabel: "All stores",
            options: (vendors?.result ?? [])
                .map((vendor) => ({ label: vendor.storeName, value: vendor.id }))
                .sort(byLabel),
        },
        {
            key: "isPublished",
            label: "Published",
            icon: Eye,
            placement: "advanced",
            options: [
                { label: "Published", value: "true" },
                { label: "Hidden", value: "false" },
            ],
        },
        {
            key: "isFeatured",
            label: "Featured",
            icon: Star,
            placement: "advanced",
            options: [
                { label: "Featured", value: "true" },
                { label: "Not featured", value: "false" },
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

    const toolbarFilters = featuredOnly
        ? allFilters.filter((filter) => filter.key !== "isFeatured")
        : allFilters;

    return { filters, toolbarFilters };
}
