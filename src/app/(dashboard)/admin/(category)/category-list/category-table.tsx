"use client";
import React, { useState } from "react";
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
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";

import { useDebounce } from "use-debounce";
import {
	useAllCategoryQuery,
	useDeleteCategoryMutation,
} from "@/redux/api/productCategoryApi";
import { toast } from "sonner";
import Pagination from "@/components/common/pagination";
export default function CategoryTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState("");
	const [search, setSearch] = useState("");
	const [value] = useDebounce(search, 1000);

	const { data: categories } = useAllCategoryQuery({
		search: value,
		limit: limit,
		page: currentPage.toString(),
	});

	const [deleteCategory] = useDeleteCategoryMutation();

	const handleDelete = async (id: string) => {
		try {
			await deleteCategory(id).unwrap();
			toast.success("Product deleted successfully");
		} catch (error: any) {
			toast.error(error?.data?.message);
		}
	};
	return (
		<React.Fragment>
			<div className="flex flex-col md:flex-row items-center justify-between gap-3">
				<div className="flex items-center gap-x-10 ">
					<div className="flex gap-x-4 items-center">
						<p>Showing</p>
						<Select onValueChange={(value) => setLimit(value)}>
							<SelectTrigger className="w-[120px]">
								<SelectValue placeholder="Select Limit" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="30">30</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Link
						href={"/admin/new-category"}
						className="block md:hidden"
					>
						<Button size={"lg"} className="cursor-pointer">
							<Plus /> Add New
						</Button>
					</Link>
				</div>
				<Input
					placeholder="Search here..."
					className="max-w-lg"
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Link href={"/admin/new-category"} className="hidden md:block">
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
						<TableHead className="text-right">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{categories?.result.map((cat) => (
						<TableRow key={cat.id}>
							<TableCell className="font-medium">
								{cat.name}
							</TableCell>
							<TableCell>
								{cat.isDeleted ? "Inactive" : "Active"}
							</TableCell>
							<TableCell className="text-right space-x-2">
								<Button variant={"secondary"}>
									<Eye />
								</Button>
								<Button variant={"outline"}>
									<Edit />
								</Button>
								<Button
									variant={"destructive"}
									onClick={() => handleDelete(cat.id)}
								>
									<Trash />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{categories?.meta && (
				<div className="flex items-center justify-between mt-10">
					<p className="max-w-fit text-xs text-muted-foreground tracking-wide">
						Showing {limit} items
					</p>
					<Pagination
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						totalPages={categories.meta.totalPages}
					/>
				</div>
			)}
		</React.Fragment>
	);
}
