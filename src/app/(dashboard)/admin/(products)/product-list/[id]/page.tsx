"use client";
import Image from "next/image";
import { use, useState } from "react";

import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import QueryError from "@/shared/components/query-error";
import { cn } from "@/shared/lib/utils";
import { useMyVendorProductByIdQuery } from "@/features/products/api/product.api";

export default function ProductDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    // Admin endpoint: the public one hides unapproved listings, which are
    // exactly the ones being inspected here.
    const {
        data: product,
        isLoading,
        error,
        refetch,
    } = useMyVendorProductByIdQuery(id);
    const [selectedImage, setSelectedImage] = useState(0);

    if (isLoading) return <SpinnerLoading />;
    if (error || !product?.result) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load this product"
                notFound={{
                    title: "Product not found",
                    description:
                        "It may have been deleted, or the link is wrong.",
                }}
            />
        );
    }

    // A listing can have no images at all; indexing into an empty array used
    // to throw here and blank the page.
    const mainImage = product.result.images?.[selectedImage]?.url;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/** Image section */}
            <div className="space-y-2">
                <div className="bg-transparent rounded-2xl overflow-hidden">
                    {mainImage ? (
                        <Image
                            src={mainImage}
                            alt="top-product-image"
                            height={600}
                            width={700}
                            className="aspect-auto "
                        />
                    ) : (
                        <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">
                            No image
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {product?.result.images.map((image, index) => (
                        <div
                            key={image.id}
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                                "h-[120px] sm:h-[100px] rounded-md overflow-hidden",
                                selectedImage === index
                                    ? "border border-primary"
                                    : "border",
                            )}
                        >
                            <Image
                                src={image.url}
                                alt="product-image"
                                height={200}
                                width={200}
                                className="h-full w-full object-top object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/** additional information section */}
            <div className="space-y-5">
                <div className="space-y-2">
                    <h3>{product?.result.name}</h3>
                    <p>
                        <strong>$ {product?.result.basePrice}</strong>
                    </p>
                </div>
                <div className="space-y-3">
                    <p className="font-medium">Product Variant</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {product?.result.variants.map((variant) => (
                            <div
                                key={variant.id}
                                className="flex items-center justify-between  px-3 py-1 border rounded"
                            >
                                <div>{variant.color}</div>
                                <div>{variant.size.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-x-10">
                    <p>
                        <strong>Featured:</strong>
                        <span className="ml-3 text-primary text-sm font-normal">
                            {product?.result.isFeatured ? "Yes" : "No"}
                        </span>
                    </p>
                    <p className="flex gap-x-1.5">
                        {" "}
                        <strong>Stock: </strong>
                        {product?.result.stockQuantity}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="font-medium">Description</p>

                    <p>{product?.result.description}</p>
                </div>
            </div>
        </div>
    );
}
