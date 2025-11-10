"use client";
import { cn } from "@/lib/utils";
import { useProductByIdQuery } from "@/redux/api/productApi";
import Image from "next/image";
import React, { use, useState } from "react";

export default function ProductDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { data: product, isLoading } = useProductByIdQuery(id);
	const [selectedImage, setSelectedImage] = useState(0);

	if (isLoading) return;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			{/** Image section */}
			<div className="space-y-2">
				<div className="bg-transparent rounded-2xl overflow-hidden">
					<Image
						src={product?.result?.images[selectedImage].url || ""}
						alt="top-product-image"
						height={600}
						width={700}
						className="aspect-auto "
					/>
				</div>
				<div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
					{product?.result.images.map((image, index) => (
						<div
							onClick={() => setSelectedImage(index)}
							className={cn(
								"h-[120px] sm:h-[100px] rounded-md overflow-hidden",
								selectedImage === index
									? "border border-primary"
									: "border"
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
							<div className="flex items-center justify-between  px-3 py-1 border rounded">
								<div>{variant.color}</div>
								<div>{variant.size}</div>
							</div>
						))}
					</div>
				</div>
				<div className="flex items-center gap-x-10">
					<p>
						{product?.result.isFeatured
							? "Featured"
							: "Not Featured"}
					</p>
					<p className="flex gap-x-1.5">
						{" "}
						<strong>Stock: </strong>
						{product?.result.stockQuantity}
					</p>
				</div>
			</div>
		</div>
	);
}
