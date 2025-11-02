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

export default function CategoryList() {
	return (
		<div className="space-y-4">
			<h4>Category List</h4>
			<div className="bg-white p-8 rounded-2xl shadow-2xl space-y-5">
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
					<Link href={"/admin/new-category"}>
						<Button size={"lg"} className="cursor-pointer">
							<Plus /> Add New
						</Button>
					</Link>
				</div>

				<Table>
					<TableHeader className="border-t">
						<TableRow className="bg-neutral-light">
							<TableHead>Name</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className="font-medium">Pant</TableCell>
							<TableCell>Active</TableCell>
							<TableCell>Credit Card</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
