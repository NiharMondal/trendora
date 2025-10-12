"use client";
import React, { useEffect, useState } from "react";
import Container from "../common/container";
import SectionHeader from "../common/section-header";
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "../product-card/product-card";
import { Button } from "../ui/button";
import { products } from "@/helping-data/products";

export default function TrendingProduct() {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	useEffect(() => {
		if (!api) return;
		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);
	return (
		<section className="py-10">
			<Container className="space-y-10">
				<SectionHeader title="Trending Now" />

				<Carousel setApi={setApi} opts={{ align: "start" }}>
					<CarouselContent>
						{products.map((product, index) => (
							<CarouselItem
								className="basis-1/2 lg:basis-1/3 xl:basis-1/4"
								key={index}
							>
								<ProductCard product={product} />
							</CarouselItem>
						))}
					</CarouselContent>
					<div className="hidden md:block">
						<CarouselPrevious />
						<CarouselNext />
					</div>
				</Carousel>
				<div className="flex justify-center gap-2 md:hidden">
					{Array.from({ length: count }).map((_, index) => (
						<Button
							key={index}
							size="icon"
							variant={current === index ? "default" : "outline"}
							className="h-3 w-3 rounded-full p-0"
							onClick={() => api?.scrollTo(index)}
						></Button>
					))}
				</div>
			</Container>
		</section>
	);
}
