"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CardUtility from "./card-utility";
import { TProduct } from "@/types/product.types";
type Props = {
	product: TProduct;
};
export default function ProductCard({ product }: Props) {
	const [selected, setSelected] = useState(0);

	return (
		<Card className="rounded p-0  shadow-none border-none group gap-2">
			<CardHeader className="relative p-0">
				<div className="relative h-[290px] border overflow-hidden">
					<CardUtility />

					<Link href={`/products/${product.slug}`}>
						{product.images && (
							<Image
								src={product.images?.[selected].url}
								alt="image"
								height={300}
								width={200}
								className="w-full h-full object-cover object-center rounded"
							/>
						)}
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
					href={`/products/${product.slug}`}
					className="text-sm tracking-wide hover:underline"
				>
					{product.name}
				</Link>
				<p className="mt-3 mb-2">
					<small className="mr-2">from </small>
					<strong>${product?.basePrice}</strong>
				</p>
				<div className="flex items-center justify-center gap-x-1.5">
					{product.images &&
						product.images?.slice(0, 5).map((item, index) => (
							<div
								key={index}
								className={cn(
									"size-8 lg:size-9 rounded-full ring-1 ring-neutral-dark/50 overflow-hidden cursor-pointer",
									selected === index
										? "ring-2 ring-primary"
										: "ring-0"
								)}
								onClick={() => setSelected(index)}
								title={item.id}
							>
								<Image
									src={item.url}
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
			</CardContent>
		</Card>
	);
}
