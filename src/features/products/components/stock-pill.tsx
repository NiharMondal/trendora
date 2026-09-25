import { cn } from "@/shared/lib/utils";

/** Below this many units a listing is flagged as running low. */
export const LOW_STOCK_THRESHOLD = 10;

/** Stock level as a coloured pill with the unit count beneath — admin tables. */
export default function StockPill({ quantity }: { quantity: number }) {
    const [label, tone] =
        quantity <= 0
            ? ["Out of stock", "bg-destructive-50 text-destructive-600"]
            : quantity < LOW_STOCK_THRESHOLD
              ? ["Low stock", "bg-warning-50 text-warning-600"]
              : ["In stock", "bg-success-50 text-success-600"];

    return (
        <span className="flex flex-col gap-0.5">
            <span
                className={cn(
                    "w-fit whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
                    tone,
                )}
            >
                {label}
            </span>
            <span className="text-xs text-muted-foreground">
                {quantity} units
            </span>
        </span>
    );
}
