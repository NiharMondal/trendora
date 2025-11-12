import SpinnerLoading from "@/components/common/spinner-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllCategoryQuery } from "@/redux/api/productCategoryApi";
import Link from "next/link";
import React from "react";

export default function CategoryFilter() {
	const { data: categories, isLoading } = useAllCategoryQuery({});

	return (
		<div className="space-y-2">
			<p className="text-lg border-b max-w-fit">Popular Categories</p>
			<ul className="text-sm  font-light tracking-wide  space-y-1">
				{isLoading && <SpinnerLoading />}
				{categories?.result.map((cat) => (
					<li key={cat.id}>
						<Link
							href={`/categories/${cat.slug}`}
							className="hover:underline"
						>
							{cat.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
