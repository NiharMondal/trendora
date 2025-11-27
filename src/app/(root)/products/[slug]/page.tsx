"use client";
import Container from "@/components/common/container";
import Quantity from "@/components/common/quantity";
import RelatedProducts from "@/components/common/related-product";
import SpinnerLoading from "@/components/common/spinner-loading";
import { Button } from "@/components/ui/button";
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
	const { data: product, isLoading } = useProductBySlugQuery(slug);

	const [quantity, setQuantity] = useState(1);
	const [currentIndex, setCurrentIndex] = useState(0);

	const [size, setSize] = useState("");

	if (isLoading) return <SpinnerLoading />;
	return (
		<Container className="py-10">
			<section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
				{/* Photo section  */}
				<div className="space-y-3">
					<PhotoProvider
						onIndexChange={(newIndex) => setCurrentIndex(newIndex)}
					>
						{/* ⭐ MAIN IMAGE — click to open fullscreen viewer */}
						{product?.result.images.map((item, index) => (
							<PhotoView src={item.url} key={item.id}>
								{index < 1 ? (
									<Image
										height={200}
										width={200}
										src={
											product?.result?.images[
												currentIndex
											]?.url
										}
										alt="Main"
										className="w-full h-[600px] object-cover rounded cursor-crosshair"
										onClick={() =>
											setCurrentIndex(currentIndex)
										}
									/>
								) : undefined}
							</PhotoView>
						))}
					</PhotoProvider>
					{/* ⭐ THUMBNAILS */}
					<div className="grid grid-cols-4 gap-4">
						{product?.result?.images.map((img, index) => (
							<Image
								key={img.id}
								height={80}
								width={100}
								src={img.url}
								alt="thumb"
								className={cn(
									"h-20 w-full object-cover rounded cursor-pointer",
									index === currentIndex
										? "ring-2 ring-blue-500"
										: ""
								)}
								onClick={() => setCurrentIndex(index)}
							/>
						))}
					</div>
				</div>

				{/* details section  */}
				<div className="space-y-3">
					<h3 className="text-neutral-dark">
						{product?.result.name}{" "}
					</h3>
					<p className="text-neutral-dark/90">
						{product?.result.description}
					</p>

					<p>Availability: In Stock</p>

					<p>
						<b>$230</b>
					</p>

					<div className="space-y-2">
						<p>Size: {size}</p>
						<div className="flex gap-x-3">
							{product?.result?.variants.map((variant, index) => (
								<div
									key={index}
									className={cn(
										"flex items-center justify-center w-14 px-2 py-1 rounded border hover:cursor-pointer",
										variant.size === size
											? "ring-2 ring-primary"
											: ""
									)}
									onClick={() => setSize(variant.size)}
									title={variant.size}
								>
									{variant.size}
								</div>
							))}
						</div>
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
