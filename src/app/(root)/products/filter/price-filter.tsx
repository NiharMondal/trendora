import { Input } from "@/components/ui/input";
import React, { SetStateAction } from "react";
type Props = {
	min: string;
	max: string;
	setMin: React.Dispatch<SetStateAction<string>>;
	setMax: React.Dispatch<SetStateAction<string>>;
};
export default function PriceFilter({ min, max, setMin, setMax }: Props) {
	return (
		<div className="space-y-2">
			<p className="text-lg font- border-b">Price</p>
			<div className="flex justify-between">
				<div className="space-y-1 flex flex-col">
					<Input
						className="max-w-[80px]"
						type="number"
						value={min}
						onChange={(e) => setMin(e.target.value)}
					/>
					<label
						htmlFor="minPrice"
						className="text-sm  font-light tracking-wide"
					>
						Min
					</label>
				</div>
				<div className="space-y-1 flex flex-col">
					<Input
						className="max-w-[80px]"
						type="number"
						value={max}
						onChange={(e) => setMax(e.target.value)}
					/>
					<label
						htmlFor="maxPrice"
						className="text-sm  font-light tracking-wide"
					>
						Max
					</label>
				</div>
			</div>
		</div>
	);
}
