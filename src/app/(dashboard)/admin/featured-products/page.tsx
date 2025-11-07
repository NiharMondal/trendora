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
import { Plus } from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default function FeaturedProductPage() {
	return (
		<div className="space-y-4">
			<h4>Featured Product List</h4>
			<div className="bg-white p-8 rounded-2xl shadow-2xl space-y-5">
				<p className="text-muted-foreground">
					Tip search by Product ID: Each product is provided with a
					unique ID, which you can rely on to find the exact product
					you need.
				</p>
				<div className="flex flex-col md:flex-row items-center justify-between gap-3">
					<div className="flex gap-x-4 items-center">
						<p>Showing</p>
						<Select>
							<SelectTrigger className="w-[120px]">
								<SelectValue placeholder="10" />
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
					<Link href={"/admin/add-product"}>
						<Button size={"lg"} className="cursor-pointer">
							<Plus /> Add New
						</Button>
					</Link>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Invoice</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Method</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className="font-medium">
								INV001
							</TableCell>
							<TableCell>Paid</TableCell>
							<TableCell>Credit Card</TableCell>
							<TableCell className="text-right">
								$250.00
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
