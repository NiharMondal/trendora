import { Minus, Plus } from "lucide-react";

type Props = {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min?: number;
};
export default function ProductQuantity({
    quantity,
    onIncrease,
    onDecrease,
    min = 1,
}: Props) {
    return (
        <div className="border rounded flex items-center justify-between max-w-[220px] px-5 py-1.5 ">
            <button
                onClick={onDecrease}
                className="size-8 inline-flex justify-center items-center cursor-pointer hover:text-accent"
                disabled={quantity <= min}
            >
                <Minus />
            </button>
            <span className="h-8 w-12 inline-flex justify-center items-center">
                {quantity}
            </span>
            <button
                className="size-8 inline-flex justify-center items-center cursor-pointer hover:text-accent"
                onClick={onIncrease}
            >
                <Plus />
            </button>
        </div>
    );
}
