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
import TableLoadingSkeleton from "@/components/common/table-loading-skeleton";
import UpdateCategory from "./update-category";
export default function CategoryTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState("10");
	const [search, setSearch] = useState("");
	const [value] = useDebounce(search, 1000);

	const { data: categories, isLoading } = useAllCategoryQuery({
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

	if (isLoading) {
		return (
			<div className="mt-5">
				<TableLoadingSkeleton />
			</div>
		);
	}
	return (
		<React.Fragment>
			<div className="flex flex-col md:flex-row items-center justify-between gap-3">
				<div className="flex items-center gap-x-10 ">
					<div className="flex gap-x-2 items-center">
						<p className="text-xs text-muted-foreground">Showing</p>
						<Select onValueChange={(value) => setLimit(value)}>
							<SelectTrigger className="w-[120px]">
								<SelectValue placeholder="Limit" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="15">15</SelectItem>
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
						<TableHead className="text-center w-[100px]">
							Action
						</TableHead>
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
								{/** update category modal */}
								<UpdateCategory id={cat.id} />
								{/** Delete button */}
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
