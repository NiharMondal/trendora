"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
	useAllProductsQuery,
	useDeleteProductMutation,
} from "@/redux/api/productApi";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { productsImage } from "@/helping-data/image";
import { useDebounce } from "use-debounce";
import { Edit, Eye, Trash } from "lucide-react";
import Pagination from "@/components/common/pagination";
import { toast } from "sonner";

export default function ProductTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState("");
	const [search, setSearch] = useState("");
	const [value] = useDebounce(search, 1000);

	const [deleteProduct] = useDeleteProductMutation();
	const { data: products } = useAllProductsQuery({
		search: value,
		limit: limit,
		page: currentPage.toString(),
	});

	const handleDelete = async (id: string) => {
		try {
			await deleteProduct(id).unwrap();
			toast.success("Product deleted successfully");
		} catch (error: any) {
			toast.error(error?.data?.message);
		}
	};
	return (
		<div className="space-y-5">
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
						<TableHead>Product</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Stock</TableHead>
						<TableHead className="text-right">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products?.result.map((p) => {
						return (
							<TableRow key={p.id}>
								<TableCell className="flex items-center gap-x-2">
									<div className="size-12">
										<Image
											src={productsImage.black}
											alt="product-image"
											width={20}
											height={20}
											className="h-full w-full object-top object-cover rounded "
										/>
									</div>
									<p className="font-semibold">{p.name}</p>
								</TableCell>
								<TableCell>{p.basePrice}</TableCell>
								<TableCell>{p.stockQuantity}</TableCell>
								<TableCell>Low Quantity</TableCell>
								<TableCell className="text-right space-x-2">
									<Button variant={"secondary"}>
										<Eye />
									</Button>
									<Button variant={"outline"}>
										<Edit />
									</Button>
									<Button
										variant={"destructive"}
										onClick={() => handleDelete(p.id)}
									>
										<Trash />
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			{products?.meta && (
				<div className="flex items-center justify-between mt-10">
					<p className="max-w-fit text-xs text-muted-foreground tracking-wide">
						Showing {limit} items
					</p>
					<Pagination
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						totalPages={products.meta.totalPages}
					/>
				</div>
			)}
		</div>
	);
}
