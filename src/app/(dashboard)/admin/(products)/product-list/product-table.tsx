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
import TableLoadingSkeleton from "@/components/common/table-loading-skeleton";
import { cn } from "@/lib/utils";
import NoDataFound from "@/components/common/no-data-found";

export default function ProductTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState("10");
	const [search, setSearch] = useState("");
	const [value] = useDebounce(search, 1000);

	const [deleteProduct] = useDeleteProductMutation();
	const { data: products, isLoading } = useAllProductsQuery({
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

	if (isLoading) {
		return (
			<div className="mt-5">
				<TableLoadingSkeleton />
			</div>
		);
	}

	if (!products?.result.length) {
		return <NoDataFound />;
	}
	return (
		<React.Fragment>
			<div className="flex flex-col md:flex-row items-center justify-between gap-3">
				<div className="flex items-center justify-between w-full md:max-w-fit">
					<div className="flex gap-x-2 items-center ">
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
						<TableHead>Product</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Stock</TableHead>
						<TableHead>Featured Product</TableHead>
						<TableHead className="text-center w-[160px]">
							Action
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products?.result.map((p, index) => {
						let stock = "";
						if (p.stockQuantity > 50) {
							stock = "Available";
						} else if (p.stockQuantity < 10) {
							stock = "Out of Stock";
						} else {
							stock = "Low Stock";
						}

						return (
							<TableRow key={p.id}>
								<TableCell className="flex items-center gap-x-2">
									<div className="size-12">
										<Image
											src={p?.images[0]?.url}
											alt="product-image"
											width={20}
											height={20}
											className="h-full w-full object-top object-cover rounded scale-90 "
										/>
									</div>
									<p className="font-semibold">{p.name}</p>
								</TableCell>
								<TableCell>{p.basePrice}</TableCell>
								<TableCell>{p.stockQuantity}</TableCell>

								<TableCell>
									<span
										className={cn(
											"text-xs font-medium",
											p.stockQuantity > 50
												? "text-primary "
												: p.stockQuantity < 1
												? "text-destructive"
												: " text-cyan-700"
										)}
									>
										{stock}
									</span>
								</TableCell>
								<TableCell>
									{p.isFeatured ? "Yes" : "No"}
								</TableCell>
								<TableCell className="text-right space-x-2">
									{/** redirect to product details page */}
									<Link href={`/admin/product-list/${p.id}`}>
										<Button variant={"secondary"}>
											<Eye />
										</Button>
									</Link>

									{/** redirect to product update page */}
									<Link
										href={`/admin/product-list/update-product/${p.id}`}
									>
										<Button variant={"outline"}>
											<Edit />
										</Button>
									</Link>
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
		</React.Fragment>
	);
}
