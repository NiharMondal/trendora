import React from "react";
import Container from "../common/container";
import Image from "next/image";
import { heroSlideImage } from "@/helping-data/image";
import Link from "next/link";

export default function Showcase() {
	return (
		<div className="py-10">
			<Container>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<ShowcaseCard />
					<ShowcaseCard />
					<ShowcaseCard />
				</div>
			</Container>
		</div>
	);
}

function ShowcaseCard() {
	return (
		<div className="relative group">
			<div className="w-full h-[220px] md:h-[180px] lg:h-[230px] overflow-hidden">
				<Image
					src={heroSlideImage.winterCollection}
					width={300}
					height={200}
					alt="image-showcase"
					className="h-full w-full object-center object-cover group-hover:scale-110 duration-500"
				/>
			</div>
			<div className="absolute inset-0">
				<div className="flex h-full items-center justify-center">
					<Link
						href={"/"}
						className="relative text-neutral-light link_style "
					>
						Hello World
					</Link>
				</div>
			</div>
		</div>
	);
}
