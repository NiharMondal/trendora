"use client";

import { FolderSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAllCategoryQuery } from "@/features/categories/api/category.api";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import NoDataFound from "@/shared/components/no-data-found";
import QueryError from "@/shared/components/query-error";

/**
 * `/categories/<slug>` is a readable alias for the catalogue, not a second
 * product list. It resolves the slug and hands over to
 * `/products?categoryId=<id>`, which already has the facets, sort, search and
 * pagination — and whose `categoryId` filter matches the category *or its
 * children*, so a parent slug like `footwear` shows its leaves' products.
 *
 * `GET /categories/:id` takes an id only, so the lookup goes through the list
 * endpoint's generic column filter (`?slug=`).
 */
export default function CategoryRedirect({ slug }: { slug: string }) {
    const router = useRouter();
    const { data, isLoading, error, refetch } = useAllCategoryQuery({
        slug,
        limit: "1",
    });
    const category = data?.result?.[0];

    useEffect(() => {
        // `replace`, so Back returns to wherever the shopper came from rather
        // than bouncing through this page again.
        if (category) router.replace(`/products?categoryId=${category.id}`);
    }, [category, router]);

    if (error) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load this category"
            />
        );
    }

    if (!isLoading && !category) {
        return (
            <NoDataFound
                icon={FolderSearch}
                title="Category not found"
                description="This category may have been renamed or removed."
                actionLabel="Browse all products"
                onAction={() => router.push("/products")}
            />
        );
    }

    return <SpinnerLoading className="py-32" />;
}
