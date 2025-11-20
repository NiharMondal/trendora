"use client";
import Container from "@/components/common/container";
import Quantity from "@/components/common/quantity";
import RelatedProducts from "@/components/common/related-product";
import ProductCard from "@/components/product-card/product-card";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { demoImages, products, variants } from "@/helping-data/products";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { PhotoProvider, PhotoView, PhotoSlider } from "react-photo-view";
export default function ProductDetails() {
	const [variant, setVariant] = useState(0);
	const [color, setColor] = useState(variants[variant].color);

	const setValue = (index: number) => {
		setVariant(index);
		setColor(variants[index].color);
	};
	return (
		<Container className="py-10">
			<section className="grid grid-cols-1 md:grid-cols-2 gap-10">
				{/* Photo section  */}
				<PhotoProvider
					speed={() => 800}
					easing={(type) =>
						type === 2
							? "cubic-bezier(0.36, 0, 0.66, -0.56)"
							: "cubic-bezier(0.34, 1.56, 0.64, 1)"
					}
				>
					{demoImages.map((item, index) => (
						<PhotoView key={index} src={item}>
							{index < 1 ? (
								<Image
									src={item}
									alt="photo"
									width={600}
									height={600}
								/>
							) : undefined}
						</PhotoView>
					))}
				</PhotoProvider>

				{/* details section  */}
				<div className="space-y-3">
					<h2>Product name </h2>
					<p>
						Product details Lorem, ipsum dolor sit amet consectetur
						adipisicing elit. Atque, Lorem ipsum dolor sit amet,
						consectetur adipisicing elit. Sint ullam tenetur neque
						accusamus, ad repellendus quisquam numquam consequatur
						animi doloribus natus ex nostrum atque hic odit impedit
						quidem culpa corrupti.
					</p>

					<p>Availability: In Stock</p>

					<p>
						<b>$230</b>
					</p>

					<div className="space-y-2">
						<p>Color: {color}</p>
						<div className="flex gap-x-3">
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
						</div>
					</div>
					<div className="space-y-2">
						<p>Quantity</p>
						<Quantity  />
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
