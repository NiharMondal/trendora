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
import CategoryTable from "./category-table";

export default function CategoryList() {
	return (
		<div className="space-y-4">
			<h4>Category List</h4>
			<div className="bg-white p-8 rounded-2xl shadow-2xl space-y-5">
				<CategoryTable />
			</div>
		</div>
	);
}
