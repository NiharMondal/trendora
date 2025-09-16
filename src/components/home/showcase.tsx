"use client";

import React from "react";
import Slider from "react-slick";

export default function ShowcaseSlider() {
	const settings = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: false,
		appendDots: (dots: React.ReactNode) => (
			<div>
				<ul className="pagination-list"> {dots} </ul>
			</div>
		),
		customPaging: () => <div className="line-active"></div>,
	};

	return (
		<div className="bg-white showcase">
			<Slider {...settings} className="showcase-slider">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
					<div key={index} className="showcase-slide">
						<div className="p-6 shadow-xl border rounded-xl bg-white">
							<h5 className="text-lg font-semibold">
								Hello world {index}
							</h5>
							<p className="text-sm text-gray-600">
								Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Libero suscipit praesentium
								nulla ratione vitae, dignissimos assumenda sequi
								doloribus incidunt eos.
							</p>
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
}
