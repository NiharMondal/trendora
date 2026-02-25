import { cn } from "@/lib/utils";

export enum PaymentStatus {
	PENDING = "PENDING",
	PAID = "PAID",
	FAILED = "FAILED",
	REFUNDED = "REFUNDED",
}

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
	PENDING: "text-secondary bg-secondary/10",
	PAID: "text-success bg-success/10",
	FAILED: "text-destructive bg-destructive/10",
	REFUNDED: "text-accent bg-accent/10",
};

export function getPaymentStatusStyles(status: PaymentStatus): string {
	const variant =
		PAYMENT_STATUS_STYLES[status] ?? PAYMENT_STATUS_STYLES.PENDING;
	return cn("text-xs px-2 py-0.5 rounded-full", variant);
}