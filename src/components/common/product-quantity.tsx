import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";

type Props = {
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
};
export default function ProductQuantity({ quantity, setQuantity }: Props) {
    const decrement = () => {
        if (quantity === 1) {
            setQuantity(1);
        } else {
            setQuantity((prev) => prev - 1);
        }
    };
    return (
        <div className="border rounded flex items-center justify-between max-w-[220px] px-5 py-1.5">
            <button
                onClick={decrement}
                className="size-8 inline-flex justify-center items-center cursor-pointer hover:text-accent"
            >
                <Minus />
            </button>
            <button className="h-8 w-12 inline-flex justify-center items-center">
                {quantity}
            </button>
            <button
                className="size-8 inline-flex justify-center items-center cursor-pointer hover:text-accent"
                onClick={() => setQuantity(quantity + 1)}
            >
                <Plus />
            </button>
        </div>
    );
}
