"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { heroSlideImage } from "@/helping-data/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function ProductCard() {
	return (
		<Card className="rounded-none p-0  shadow-none border-none group gap-2">
			<CardHeader className="relative p-0">
				<div className="relative h-[290px] border">
					<Image
						src={heroSlideImage.kidsCollection}
						alt="image"
						height={300}
						width={200}
						className="w-full h-full object-cover object-top"
					/>
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
					href={"/"}
					className="text-sm tracking-wide hover:underline"
				>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Ratione, beatae?
				</Link>
				<p className="mt-3 mb-2">
					<small>from</small> <b>$32.33</b>
				</p>
				<div className="flex items-center justify-center gap-x-1.5">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							className="size-12 rounded-full ring-1 ring-neutral-dark/50"
						>
							Color
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
