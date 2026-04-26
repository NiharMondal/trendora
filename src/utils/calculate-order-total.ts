import { TCartItem } from "@/components/types/cart.types";
import { envConfig } from "@/config/env-config";

type TOrderCalculation = {
    subtotal: number;
    tax: number;
    shippingCost: number;
    totalAmount: number;
};

export function calculateOrderTotals(items: TCartItem[]): TOrderCalculation {
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const tax = subtotal * Number(envConfig.tax_rate);
    const shippingCost =
        subtotal >= Number(envConfig.free_shipping_threshold)
            ? 0
            : Number(envConfig.shipping_cost);
    const totalAmount = subtotal + tax + shippingCost;
    return { subtotal, tax, shippingCost, totalAmount };
}



export const currencyFormatter = (n: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(n);