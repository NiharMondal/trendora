import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, Trash } from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default function OrderListPage() {
	return (
		<div className="space-y-4">
			<h4>Order List</h4>
			<div className="bg-white p-5 rounded-2xl shadow-md space-y-5">
				<div className="flex  items-center justify-between gap-3">
					<div className="flex gap-x-2 items-center">
						<p className="text-xs text-muted-foreground">Showing</p>
						<Select>
							<SelectTrigger className="w-[80px] md:w-[120px]">
								<SelectValue placeholder="Limit" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10" defaultValue={"10"}>
									10
								</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="30">30</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Input placeholder="Search here..." className="max-w-lg" />
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Total Amount</TableHead>
							<TableHead>Order Status</TableHead>
							<TableHead>Payment Method</TableHead>
							<TableHead>Payment Status</TableHead>
							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className="font-medium">
								INV001
							</TableCell>
							<TableCell>4532</TableCell>
							<TableCell>Ongoing</TableCell>
							<TableCell>Cash On Delivery</TableCell>
							<TableCell>Paid</TableCell>
							<TableCell className="text-right space-x-2">
								<Button variant={"secondary"}>
									<Eye />
								</Button>
								<Button variant={"outline"}>
									<Edit />
								</Button>
								<Button variant={"destructive"}>
									<Trash />
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>

				<div className="flex justify-end">Hello</div>
			</div>
		</div>
	);
}
