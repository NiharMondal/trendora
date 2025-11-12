"use client";
import Container from "@/components/common/container";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import PriceFilter from "./filter/price-filter";
import CategoryFilter from "./filter/category-filter";
import Brand from "./filter/brand";
import Size from "./filter/size";

export default function ProductPage() {
	const [min, setMin] = useState("0");
	const [max, setMax] = useState("10000");

	return (
		<Container className="flex gap-x-5">
			<div className="pr-2 border border-gray-50 space-y-3">
				{/**Category filter section */}
				<CategoryFilter />

				{/**Price filter section */}
				<PriceFilter
					min={min}
					max={max}
					setMin={setMin}
					setMax={setMax}
				/>
				<Brand />
				<Size />
			</div>
		</Container>
	);
}
