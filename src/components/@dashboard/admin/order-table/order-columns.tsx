import { Button } from "@/components/ui/button";
import { TOrder } from "@/types/order.types";
import { DataTableColumn } from "@/types/table.types";
import { getOrderStatusStyles, OrderStatus } from "@/utils/order-status";
import { getPaymentStatusStyles, PaymentStatus } from "@/utils/payment-status";
import { FileSearch } from "lucide-react";
import moment from "moment";
import Link from "next/link";

export const orderColumns: DataTableColumn<TOrder>[] = [
	{
		key: "userInfo",
		header: "User",
		cell: (row) => {
			return (
				<div className="flex items-center gap-2">
					<img
						src={row.user.avatar}
						alt={row.user.name}
						className="size-10 rounded-full object-cover ring-1 ring-primary/25"
					/>
					<div>
						<p className="font-medium">{row.user.name}</p>
						<p className="text-xs text-muted-foreground">
							{row.user.email}
						</p>
					</div>
				</div>
			);
		},
	},
	{
		key: "orderNumber",
		header: "Order ID",
		cell: (row) => {
			const order = row;
			return <span>{order.orderNumber}</span>;
		},
	},

	{
		key: "subtotal",
		header: "Total Amount",
		cell: (row) => {
			const order = row;
			return <span>${order.totalAmount}</span>;
		},
	},
	{
		key: "orderStatus",
		header: "Order Status",
		cell: (row) => {
			const order = row;
			return (
				<span
					className={getOrderStatusStyles(
						order.orderStatus as OrderStatus,
					)}
				>
					{order.orderStatus}
				</span>
			);
		},
	},
	{
		key: "paymentMethod",
		header: "Payment Method",
		cell: (row) => {
			const order = row;
			return <span>{order.paymentMethod.split("_").join(" ")}</span>;
		},
	},
	{
		key: "paymentStatus",
		header: "Payment Status",
		cell: (row) => {
			const order = row;
			return (
				<span
					className={getPaymentStatusStyles(
						order.paymentStatus as PaymentStatus,
					)}
				>
					{order.paymentStatus}
				</span>
			);
		},
	},
	{
		key: "createdAt",
		header: "Ordered At",
		cell: (row) => {
			const order = row;
			return <span>{moment(order.createdAt).format("ll")}</span>;
		},
	},
	{
		key: "actions",
		header: "Actions",
		cell: (row) => {
			const order = row;
			return (
				<Link href={`/admin/order-details/${order.id}`}>
					<Button variant="outline" size="sm">
						<FileSearch />
						Details
					</Button>
				</Link>
			);
		},
	},
];
