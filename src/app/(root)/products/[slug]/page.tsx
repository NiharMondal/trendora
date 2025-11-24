"use client";
import Container from "@/components/common/container";
import Quantity from "@/components/common/quantity";
import RelatedProducts from "@/components/common/related-product";
import { Button } from "@/components/ui/button";

import { demoImages, variants } from "@/helping-data/products";
import { cn } from "@/lib/utils";
import { useProductBySlugQuery } from "@/redux/api/productApi";
import Image from "next/image";
import React, { use, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

export default function ProductDetails({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = use(params);
	const { data: product } = useProductBySlugQuery(slug);
	console.log(product);
	const [quantity, setQuantity] = useState(1);
	const [selectedPhoto, setSelectedPhoto] = useState(0);

	return (
		<Container className="py-10">
			<section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
				{/* Photo section  */}
				<div className="lg:col-span-2 flex flex-col lg:flex-row gap-3">
					<PhotoProvider
						speed={() => 800}
						easing={(type) =>
							type === 2
								? "cubic-bezier(0.36, 0, 0.66, -0.56)"
								: "cubic-bezier(0.34, 1.56, 0.64, 1)"
						}
					>
						{product?.result?.images?.map((item, index) => (
							<PhotoView key={index} src={item.id}>
								{index < 1 ? (
									<Image
										src={item.url}
										alt="Product photo"
										width={600}
										height={600}
										loading="lazy"
										className="hover:cursor-crosshair"
									/>
								) : undefined}
							</PhotoView>
						))}
					</PhotoProvider>
					<div className="flex flex-row lg:flex-col gap-3">
						{product?.result?.images.map((img, index) => (
							<div
								key={img.id}
								className={cn(
									"overflow-hidden rounded border size-[100px]"
								)}
								onClick={() => setSelectedPhoto(index)}
							>
								<Image
									src={img.url}
									alt={img.productId}
									height={200}
									width={200}
									className="size-full object-center object-cover"
								/>
							</div>
						))}
					</div>
				</div>

				{/* details section  */}
				<div className="space-y-3">
					<h2>{product?.result.name} </h2>
					<p>{product?.result.description}</p>

					<p>Availability: In Stock</p>

					<p>
						<b>$230</b>
					</p>

					<div className="space-y-2">
						<p>Color: </p>
						{/* <div className="flex gap-x-3">
							{variants.map((item, index) => (
								<div
									key={index}
									className={cn(
										"size-8 lg:size-9 rounded-full ring-1 ring-neutral-dark/50 overflow-hidden",
										variant === index
											? "ring-2 ring-primary"
											: "ring-0"
									)}
									onClick={() => setValue(index)}
									title={item.color}
								>
									<Image
										src={item.image || ""}
										alt="image-variant"
										height={20}
										width={20}
										className={cn(
											"size-8 lg:size-9 rounded-full object-cover object-center"
										)}
									/>
								</div>
							))}
						</div> */}
					</div>
					<div className="space-y-2">
						<p>Quantity</p>
						<Quantity
							quantity={quantity}
							setQuantity={setQuantity}
						/>
					</div>

					<Button
						className="rounded-sm text-lg font-medium uppercase"
						size={"lg"}
					>
						Add To Cart
					</Button>
				</div>
			</section>
			{/* related products  */}
			<RelatedProducts />
		</Container>
	);
}
