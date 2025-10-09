"use client";
import Container from "@/components/common/container";
import { demoImages, products } from "@/helping-data/products";
import Image from "next/image";
import React, { useState } from "react";
import { PhotoProvider, PhotoView, PhotoSlider } from "react-photo-view";
export default function ProductDetails() {
	const [visible, setVisible] = useState(false);
	const [index, setIndex] = useState(0);
	return (
		<section className="py-10">
			<Container className="grid grid-cols-1 md:grid-cols-2">
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

					{/* {demoImages.slice(1).map((item, index) => (
						<PhotoView key={index + 1} src={item}>
							<span style={{ display: "none" }}></span>
						</PhotoView>
					))} */}
				</PhotoProvider>

				{/* details section  */}
			</Container>
		</section>
	);
}
