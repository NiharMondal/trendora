import React from "react";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { productsImage } from "@/helping-data/image";

const invoices = [
	{
		invoice: "INV001",
		paymentStatus: "Paid",
		totalAmount: "$250.00",
		paymentMethod: "Credit Card",
	},
	{
		invoice: "INV002",
		paymentStatus: "Pending",
		totalAmount: "$150.00",
		paymentMethod: "PayPal",
	},
	{
		invoice: "INV003",
		paymentStatus: "Unpaid",
		totalAmount: "$350.00",
		paymentMethod: "Bank Transfer",
	},
	{
		invoice: "INV004",
		paymentStatus: "Paid",
		totalAmount: "$450.00",
		paymentMethod: "Credit Card",
	},
	{
		invoice: "INV005",
		paymentStatus: "Paid",
		totalAmount: "$550.00",
		paymentMethod: "PayPal",
	},
	{
		invoice: "INV006",
		paymentStatus: "Pending",
		totalAmount: "$200.00",
		paymentMethod: "Bank Transfer",
	},
	{
		invoice: "INV007",
		paymentStatus: "Unpaid",
		totalAmount: "$300.00",
		paymentMethod: "Credit Card",
	},
];

export default function Orders() {
	return (
		<div className="bg-white rounded-2xl shadow-2xl p-5 ">
			<h4 className="mb-10 font-semibold text-black">Orders</h4>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Product</TableHead>
						<TableHead>Price</TableHead>
						<TableHead className="text-right">
							Delivery Date
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{invoices.map((invoice) => (
						<TableRow key={invoice.invoice}>
							<TableCell className="flex gap-x-2 items-center">
								<div className="flex items-center justify-center size-14 bg-gray-100 rounded-md">
									<Image
										src={productsImage.gray}
										alt="Product"
										height={40}
										width={40}
										className="size-10 object-center object-cover rounded-md"
									/>
								</div>
								<p>Product name here</p>
							</TableCell>

							<TableCell>231</TableCell>
							<TableCell className="text-right">20 nov</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
