"use client";

import {
    BadgeCheck,
    Boxes,
    Eye,
    Layers,
    Package,
    PackageX,
    Star,
    Store,
    Tag,
    Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, TableLoading } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import { adminProductSortOptions } from "@/shared/constants/sort-options";
import { productGenderOptions } from "@/shared/constants/mock-products";
import { TDModal } from "@/shared/components/td-modal";
import { Button } from "@/shared/ui/button";
import {
    useAllProductsForAdminQuery,
    useDeleteProductMutation,
} from "@/features/products/api/product.api";
import { useAllBrandQuery } from "@/features/brands/api/brand.api";
import { useAllCategoryQuery } from "@/features/categories/api/category.api";
import { productStatusMap } from "@/features/orders/constants/status-maps";
import { useAllVendorsForAdminQuery } from "@/features/vendors/api/vendor.api";

import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { productColumns } from "./product-columns";
import { getApiErrorMessage } from "@/shared/utils/api-error";

export default function ProductTable() {
    // Every key is a plain Product column: `/products/admin/all` runs the
    // generic `filter()`, which turns an unknown key into an exact-match
    // `where`. So "low stock" cannot be offered without a backend change —
    // only "out of stock" (`stockQuantity=0`) is an equality.
    const filters = useTableFilters({
        defaultSortBy: "createdAt:desc",
        defaultFilters: {
            status: "",
            isPublished: "",
            isFeatured: "",
            stockQuantity: "",
            vendorId: "",
            categoryId: "",
            brandId: "",
            gender: "",
        },
    });

    // Option lists for the filters. 100 is the same ceiling the product
    // form's pickers use.
    const { data: vendors } = useAllVendorsForAdminQuery({ limit: "100" });
    const { data: categories } = useAllCategoryQuery({ limit: "100" });
    const { data: brands } = useAllBrandQuery({ limit: "100" });

    const toOptions = (rows?: { id: string; name: string }[]) =>
        (rows ?? [])
            .map((row) => ({ label: row.name, value: row.id }))
            .sort((a, b) => a.label.localeCompare(b.label));

    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

    const [deleteProduct, { isLoading: isDeleting }] =
        useDeleteProductMutation();

    // Admin endpoint: `/products` only returns approved+published listings,
    // so the admin catalogue would silently hide every draft and rejection.
    const {
        data: products,
        isLoading,
        isFetching,
        error: listError,
        refetch: refetchList,
    } = useAllProductsForAdminQuery(
        filters.queryParams as Record<string, string>,
    );

    const confirmDelete = async () => {
        if (!deleteProductId) return;
        try {
            await deleteProduct(deleteProductId).unwrap();
            toast.success("Product deleted successfully");
            setDeleteProductId(null);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };
    const handleDeleteProduct = async (id: string) => {
        setDeleteProductId(id);
    };

    if (isLoading) return <TableLoading />;

    return (
        <div className="space-y-5 bg-white p-5 rounded-md">
            <DataTable
                title="Product catalogue"
                description="Every listing from every store, including drafts and rejections."
                icon={Package}
                columnConfig={{ storageKey: "admin-products" }}
                toolbarFilters={[
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
                        label: "Published",
                        icon: Eye,
                        allLabel: "Any",
                        options: [
                            { label: "Published", value: "true" },
                            { label: "Hidden", value: "false" },
                        ],
                    },
                    {
                        key: "isFeatured",
                        label: "Featured",
                        icon: Star,
                        allLabel: "Any",
                        options: [
                            { label: "Featured", value: "true" },
                            { label: "Not featured", value: "false" },
                        ],
                    },
                    {
                        key: "stockQuantity",
                        label: "Stock",
                        icon: PackageX,
                        allLabel: "Any stock",
                        options: [{ label: "Out of stock", value: "0" }],
                    },
                    {
                        key: "vendorId",
                        label: "Store",
                        icon: Store,
                        allLabel: "All stores",
                        options: (vendors?.result ?? [])
                            .map((vendor) => ({
                                label: vendor.storeName,
                                value: vendor.id,
                            }))
                            .sort((a, b) => a.label.localeCompare(b.label)),
                    },
                    {
                        key: "categoryId",
                        label: "Category",
                        icon: Layers,
                        allLabel: "All categories",
                        options: toOptions(categories?.result),
                    },
                    {
                        key: "brandId",
                        label: "Brand",
                        icon: Tag,
                        allLabel: "All brands",
                        options: toOptions(brands?.result),
                    },
                    {
                        key: "gender",
                        label: "Gender",
                        icon: Users,
                        allLabel: "Any",
                        options: productGenderOptions,
                    },
                ]}
                emptyState={{
                    icon: Boxes,
                    title: filters.isFiltered
                        ? "No products match these filters"
                        : "No products yet",
                    description: filters.isFiltered
                        ? "Try clearing a filter or two."
                        : "Products appear here as soon as a store creates one.",
                    ...(filters.isFiltered && {
                        actionLabel: "Clear all filters",
                        onAction: filters.handleResetFilters,
                    }),
                }}
                columns={productColumns(handleDeleteProduct)}
                data={products?.result || []}
                rowKey={(row) => row.id}
                error={listError}
                onRetry={refetchList}
                isFetching={isFetching}
                filters={filters}
                meta={products?.meta}
                sortByOptions={adminProductSortOptions}
                // The admin list searches name and description.
                placeholder="Search by name or description..."
            />

            <TDModal
                open={!!deleteProductId}
                onOpenChange={(open) => !open && setDeleteProductId(null)}
                title="Are you sure you want to delete this product?"
                description="This action cannot be undone."
            >
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setDeleteProductId(null)}
                    >
                        Cancel
                    </Button>
                    <TDButton
                        variant="destructive"
                        onClick={confirmDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </TDButton>
                </div>
            </TDModal>
        </div>
    );
}
