"use client";

import { heroSlide } from "@/helping-data/hero";
import React from "react";
import Slider from "react-slick";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function HeroSection() {
	const settings = {
		dots: true,
		arrows: false,
		fade: true,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,

		appendDots: (dots: React.ReactNode) => (
			<div>
				<ul className="pagination-list"> {dots} </ul>
			</div>
		),
		customPaging: () => <div className="line-active"></div>,
	};
	return (
		<div className="overflow-hidden relative">
			<Slider {...settings}>
				{heroSlide.map((item, index) => (
					<div key={item.id} className="relative">
						<Image
							src={item.image}
							height={700}
							width={1200}
							alt="collection-image"
							className="min-w-full h-[300px] sm:h-[380px] md:h-[400px] lg:h-[420px] xl:h-[540px] object-center object-cover"
						/>
						<div className="absolute inset-0">
							<div
								className={cn(
									"relative min-h-full min-w-full p-5  md:p-10 flex items-center",
									index === 0
										? "justify-start md:pl-20 lg:pl-32 xl:pl-64"
										: index === 1
										? "lg:justify-end md:pr-20 lg:pr-32"
										: index === 2
										? "justify-around"
										: "justify-center"
								)}
							>
								<div
									className={cn(
										"space-y-1 lg:space-y-3.5",
										index !== 0 ? "text-white" : ""
									)}
								>
									<p className="uppercase text-xl font-bold">
										{item.title}
									</p>
									<h1 className="capitalize max-w-[280px] md:max-w-lg">
										{item.heading}
									</h1>
									<p
										className={cn(
											"tracking-wider max-w-sm md:max-w-full",
											index === 0
												? "text-muted"
												: "text-white"
										)}
									>
										{item.short_description}
									</p>
									<Link href={item.link}>
										<Button
											size={"lg"}
											className="cursor-pointer uppercase font-bold tracking-wider text-xs"
										>
											Discover now!
										</Button>
									</Link>
								</div>
							</div>
							{/* {item.id === "1" && (
								<div className="h-full flex items-center justify-start md:justify-around pl-5 ">
									<div className="space-y-3.5 animated-section first-section">
										<p className="uppercase text-xl font-bold">
											{item.title}
										</p>
										<h1 className="capitalize max-w-xs md:max-w-lg">
											{item.heading}
										</h1>
										<p className="text-muted tracking-wider max-w-sm md:max-w-full">
											{item.short_description}
										</p>
										<Link href={item.link}>
											<Button
												size={"lg"}
												className="cursor-pointer uppercase font-bold tracking-wider text-xs"
											>
												Discover now!
											</Button>
										</Link>
									</div>
									<div></div>
								</div>
							)}
							{item.id === "2" && (
								<div className="h-full flex items-center justify-center xl:justify-around  pl-5">
									<div></div>
									<div className="space-y-3.5 text-neutral-light">
										<p className="uppercase text-xl font-bold ">
											{item.title}
										</p>
										<h1 className="capitalize max-w-xs ">
											{item.heading}
										</h1>
										<p className="tracking-wider max-w-sm md:max-w-full">
											{item.short_description}
										</p>
										<Link href={item.link}>
											<Button
												size={"lg"}
												className="cursor-pointer uppercase font-bold tracking-wider text-xs"
											>
												Discover now!
											</Button>
										</Link>
									</div>
								</div>
							)}
							{item.id === "3" && (
								<div className="h-full flex items-center   justify-center  pl-5">
									<div className="space-y-3.5 text-neutral-light text-center">
										<p className="uppercase text-xl font-bold ">
											{item.title}
										</p>
										<h1 className="capitalize max-w-sm">
											{item.heading}
										</h1>
										<p className="tracking-wider max-w-sm md:max-w-full">
											{item.short_description}
										</p>
										<Link href={item.link}>
											<Button
												size={"lg"}
												className="cursor-pointer uppercase font-bold tracking-wider text-xs"
											>
												Discover now!
											</Button>
										</Link>
									</div>
								</div>
							)} */}
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
}
