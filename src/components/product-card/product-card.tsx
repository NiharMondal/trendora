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
import { cn } from "@/lib/utils";
import CardUtility from "./card-utility";
type ProductVariant = {
	size: string;
	color: string;
	stock: number;
	price: number;
	image: StaticImageData;
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
					<CardUtility />
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
					{productVariants &&
						productVariants?.map((item, index) => (
							<Tooltip key={index}>
								<TooltipTrigger className="cursor-pointer">
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
