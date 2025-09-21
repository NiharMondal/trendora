"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

import { heroSlide } from "@/helping-data/hero";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export function Hero() {
	return (
		<Carousel
		// plugins={[
		// 	Autoplay({
		// 		delay: 2000,
		// 	}),
		// ]}
		>
			<CarouselContent>
				{heroSlide.map((item, index) => (
					<CarouselItem key={index} className="relative">
						<div className="h-[550px] lg:h-[700px] w-full overflow-hidden ">
							<Image
								src={item.image}
								width={1200}
								height={600}
								alt={item.heading}
								className="w-full h-full object-center lg:object-center object-cover aspect-square moving"
							/>
						</div>

						<section className="absolute inset-0">
							{item.id === "1" && (
								<div className="flex w-full h-full items-center  px-10 md:px-24 lg:px-40 xl:px-72">
									<div className="space-y-2 md:space-y-3">
										<h1 className="max-w-lg capitalize">
											{item.heading}
										</h1>
										<p className="text-lg font-medium uppercase">
											{item.title}
										</p>
										<p className="text-muted-foreground">
											{item.short_description}
										</p>
										<Link href={item.link}>
											<Button className="uppercase tracking-wider cursor-pointer">
												discover now!
											</Button>
										</Link>
									</div>
								</div>
							)}
							{item.id === "2" && (
								<div className="flex w-full h-full items-center  justify-end pr-10 md:pr-20 lg:pr-36">
									<div className="space-y-3 text-right text-white">
										<h1 className="max-w-lg capitalize">
											{item.heading}
										</h1>
										<p className="text-lg font-medium uppercase">
											{item.title}
										</p>
										<p className="text-neutral-light/80">
											{item.short_description}
										</p>
										<Link href={item.link}>
											<Button className="uppercase tracking-wider cursor-pointer">
												discover now!
											</Button>
										</Link>
									</div>
								</div>
							)}
							{item.id === "3" && (
								<div className="flex w-full h-full items-center  justify-center">
									<div className="space-y-3 text-center text-neutral-light">
										<h1 className="max-w-lg capitalize">
											{item.heading}
										</h1>
										<p className="text-lg font-medium uppercase">
											{item.title}
										</p>
										<p className="text-neutral-light/80">
											{item.short_description}
										</p>
										<Link href={item.link}>
											<Button className="uppercase tracking-wider cursor-pointer">
												discover now!
											</Button>
										</Link>
									</div>
								</div>
							)}
						</section>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}
