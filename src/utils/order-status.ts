import { cn } from "@/lib/utils";

export enum OrderStatus {
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	SHIPPED = "SHIPPED",
	DELIVERED = "DELIVERED",
	CANCELED = "CANCELED",
}
type OrderStatusVariant = {
	text: string;
	bg: string;
};

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
	PENDING: "text-secondary bg-secondary/10",
	PROCESSING: "text-accent bg-accent/10",
	SHIPPED: "text-primary bg-primary/10",
	DELIVERED: "text-success bg-success/10",
	CANCELED: "text-destructive bg-destructive/10",
};

export function getOrderStatusStyles(status: OrderStatus): string {
	const variant = ORDER_STATUS_STYLES[status] ?? ORDER_STATUS_STYLES.PENDING;
	return cn("text-xs px-2 py-0.5 rounded-full", variant);
}
