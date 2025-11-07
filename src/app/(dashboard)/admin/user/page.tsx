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
import Image from "next/image";
import { image, productsImage } from "@/helping-data/image";

export default function UserPage() {
	return (
		<div className="space-y-4">
			<h4>Order List</h4>
			<div className="bg-white p-8 rounded-2xl shadow-md space-y-5">
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
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>

							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className="flex items-center gap-x-2">
								<Image
									src={productsImage.red}
									alt="User-1"
									height={40}
									width={40}
									className="size-14 rounded-md overflow-hidden object-center object-cover"
								/>
								<div className="space-y-1.5">
									<p className="font-semibold">
										Kristin Watson
									</p>
									<p className="text-muted-foreground">
										Dhaka, Bangladesh
									</p>
								</div>
							</TableCell>
							<TableCell>test@gmail.com</TableCell>
							<TableCell>01391929191</TableCell>

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
