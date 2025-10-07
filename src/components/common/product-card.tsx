"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image, { StaticImageData } from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
type ProductVariant = {
	size: string;
	color: string;
	stock: number;
	price: number;
	image: StaticImageData | null;
};
type ProductCardProps = {
	product: {
		name: string;
		slug: string;
		basePrice: number;
		productVariants?: ProductVariant[];
	};
};
export default function ProductCard({ product }: ProductCardProps) {
	const { name, slug, basePrice, productVariants } = product;
	const [variant, setVariant] = useState(0);
	return (
		<Card className="rounded-none p-0  shadow-none border-none group gap-2">
			<CardHeader className="relative p-0">
				<div className="relative h-[290px] border ">
					<div className="absolute right-0 top-0 overflow-hidden">
						<div className="flex flex-col gap-y-2 pr-3 pt-3 translate-x-12 group-hover:translate-x-0 duration-300 ">
							<Tooltip>
								<TooltipTrigger className="bg-neutral-light size-9 rounded-full flex items-center justify-center text-neutral-dark/80">
									<Heart />
								</TooltipTrigger>
								<TooltipContent side="left">
									<p>Add to Wishlist</p>
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger className="bg-neutral-light size-9 rounded-full flex items-center justify-center text-neutral-dark/80">
									<Eye />
								</TooltipTrigger>
								<TooltipContent side="left">
									<p>Quick View</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>
					<Link href={`/products/${slug}`}>
						<Image
							src={productVariants?.[variant].image || ""}
							alt="image"
							height={300}
							width={200}
							className="w-full h-full object-cover object-center"
						/>
					</Link>
					<div className="absolute -bottom-10 opacity-0 left-0 right-0 group-hover:bottom-0 duration-200 group-hover:opacity-100">
						<Button
							className="w-full cursor-pointer rounded-none"
							variant={"outline"}
							size={"lg"}
						>
							Quick Add
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className=" text-center p-0">
				<Link
					href={`/products/${slug}`}
					className="text-sm tracking-wide hover:underline"
				>
					{name}
				</Link>
				<p className="mt-3 mb-2">
					<small>from</small>{" "}
					{productVariants ? (
						<strong>{productVariants[variant].price}</strong>
					) : (
						<strong>{basePrice}</strong>
					)}
				</p>
				<div className="flex items-center justify-center gap-x-1.5">
					{productVariants?.map((item, index) => (
						<Tooltip key={index}>
							<TooltipTrigger>
								<div
									key={index}
									className={cn(
										"size-8 lg:size-9 rounded-full ring-1 ring-neutral-dark/50 overflow-hidden",
										variant === index
											? "ring-2 ring-primary"
											: "ring-0"
									)}
									onClick={() => setVariant(index)}
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
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>{item.color}</p>
							</TooltipContent>
						</Tooltip>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
