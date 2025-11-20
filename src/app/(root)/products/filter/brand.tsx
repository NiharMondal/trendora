import SpinnerLoading from "@/components/common/spinner-loading";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAllBrandQuery } from "@/redux/api/brandApi";
import React, { useState } from "react";

export default function Brand() {
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

	const { data: brands, isLoading } = useAllBrandQuery({});

	const handleBrandChange = (brand: string, checked: boolean) => {
		setSelectedBrands((prev) =>
			checked ? [...prev, brand] : prev.filter((b) => b !== brand)
		);
	};
	return (
		<div className="space-y-2">
			<p className="text-lg border-b max-w-fit">Popular Categories</p>
			<ul className="text-sm  font-light tracking-wide  space-y-1">
				{isLoading && <SpinnerLoading />}
				{brands?.result.map((brand) => (
					<li key={brand.id} className="flex items-start gap-2">
						<Checkbox
							id={brand.id}
							checked={selectedBrands.includes(brand.id)}
							onCheckedChange={(checked) =>
								handleBrandChange(brand.id, checked as boolean)
							}
						/>
						<Label>{brand.name}</Label>
					</li>
				))}
			</ul>
		</div>
	);
}
