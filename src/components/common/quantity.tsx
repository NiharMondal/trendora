import React, { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

type Props = {
	quantity: number;
	setQuantity: React.Dispatch<React.SetStateAction<number>>;
};
export default function Quantity({ quantity, setQuantity }: Props) {
	const decrement = () => {
		if (quantity === 1) {
			setQuantity(1);
		} else {
			setQuantity((prev) => prev - 1);
		}
	};
	return (
		<div className="border flex items-center max-w-fit p-1">
			<button
				onClick={decrement}
				className="size-8 inline-flex justify-center items-center cursor-pointer"
			>
				<Minus />
			</button>
			<button className="h-8 w-12 inline-flex justify-center items-center">
				{quantity}
			</button>
			<button
				className="size-8 inline-flex justify-center items-center cursor-pointer"
				onClick={() => setQuantity(quantity + 1)}
			>
				<Plus />
			</button>
		</div>
	);
}
