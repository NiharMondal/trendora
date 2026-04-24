import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

type Props = {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min?: number;
    className?: string;
};
export default function ProductQuantity({
    quantity,
    onIncrease,
    onDecrease,
    min = 1,
    className,
}: Props) {
    return (
        <div
            className={cn(
                "border rounded flex items-center justify-between px-5 py-1.5  max-w-[200px]",
                className,
            )}
        >
            <button
                onClick={onDecrease}
                className="size-8 inline-flex justify-center items-center cursor-pointer hover:text-accent"
                disabled={quantity <= min}
            >
                <Minus size={18} />
            </button>
            <span className="h-8 w-12 inline-flex justify-center items-center">
                {quantity}
            </span>
            <button
                className="size-8 inline-flex justify-center items-center cursor-pointer hover:text-accent"
                onClick={onIncrease}
            >
                <Plus size={18} />
            </button>
        </div>
    );
}
