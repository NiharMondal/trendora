import React, { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

export default function Quantity() {
	const [value, setValue] = useState(1);

	const decrement = () => {
		if (value === 1) {
			setValue(1);
		} else {
			setValue((prev) => prev - 1);
		}
	};
	return (
		<div className="space-y-2">
			<p>Quantity</p>
			<div className="border flex items-center max-w-fit p-1">
				<button
					onClick={decrement}
					className="size-8 inline-flex justify-center items-center cursor-pointer"
				>
					<Minus />
				</button>
				<button className="h-8 w-12 inline-flex justify-center items-center">
					{value}
				</button>
				<button
					className="size-8 inline-flex justify-center items-center cursor-pointer"
					onClick={() => setValue(value + 1)}
				>
					<Plus />
				</button>
			</div>
		</div>
	);
}
