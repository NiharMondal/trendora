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

export function TableDemo() {
	return (
		<Table>
			<TableCaption>A list of your recent invoices.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">Invoice</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Method</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{invoices.map((invoice) => (
					<TableRow key={invoice.invoice}>
						<TableCell className="font-medium">
							{invoice.invoice}
						</TableCell>
						<TableCell>{invoice.paymentStatus}</TableCell>
						<TableCell>{invoice.paymentMethod}</TableCell>
						<TableCell className="text-right">
							{invoice.totalAmount}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={3}>Total</TableCell>
					<TableCell className="text-right">$2,500.00</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
}

export default function ProductsOverview() {
	return (
		<div className="col-span-full bg-white rounded-2xl shadow-2xl p-5 ">
			<h4 className="mb-10 font-semibold text-black">Product Overview</h4>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Product ID</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{invoices.map((invoice) => (
						<TableRow key={invoice.invoice}>
							<TableCell className=" flex items-center gap-x-2">
								<div className="size-16 flex items-center justify-center bg-gray-100 rounded-md">
									<Image
										src={productsImage.gray}
										alt="Product"
										height={40}
										width={40}
										className="size-12 object-center object-cover rounded-md"
									/>
								</div>
								<p>Product name here</p>
							</TableCell>
							<TableCell>9481324190</TableCell>
							<TableCell>$11.32</TableCell>
							<TableCell>121</TableCell>
							<TableCell>Available</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
