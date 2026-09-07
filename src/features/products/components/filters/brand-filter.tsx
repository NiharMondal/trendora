import { useState } from "react";

import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { useAllBrandQuery } from "@/features/brands/api/brand.api";

export default function Brand() {
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

	const { data: brands, isLoading } = useAllBrandQuery({});

	const handleBrandChange = (brand: string, checked: boolean) => {
		setSelectedBrands((prev) =>
			checked ? [...prev, brand] : prev.filter((b) => b !== brand),
		);
	};
	return (
		<div className="space-y-2">
			<p className="text-lg border-b max-w-fit">Popular Brands</p>
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
