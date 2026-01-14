import { cn } from "@/lib/utils";
import React from "react";
type Props = {
    basePrice: string;
    discountPrice?: string | null;
};
export default function ProductPrice({ basePrice, discountPrice }: Props) {
    return (
        <p className="flex items-center gap-x-2">
            {discountPrice && <strong>${discountPrice}</strong>}
            <span
                className={cn("text-muted-foreground", {
                    "line-through": discountPrice,
                })}
            >
                ${basePrice}
            </span>
        </p>
    );
}
