import React from "react";
import Container from "../common/container";
import Image from "next/image";
import { image } from "@/helping-data/image";
import { Button } from "../ui/button";

export default function OfferSection() {
	return (
		<div className="h-[300px] md:h-[500px] lg:h-[600px] relative ">
			<Image
				src={image.offerBackground}
				width={1200}
				height={400}
				className="h-full w-full object-top object-cover"
				alt="offer-image"
			/>

			<div className="absolute inset-0">
				<div className="flex items-center justify-center min-h-full">
					<div className="space-y-2 text-center text-neutral-dark pt-32">
						<h2>See Offers</h2>
						<p className="text-neutral-dark/90">
							Grab your desired products <b>on time</b>
						</p>
						<Button size={"lg"} className="uppercase font-semibold">
							Shop Now More
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
