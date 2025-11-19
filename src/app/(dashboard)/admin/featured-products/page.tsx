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
import FeaturedTable from "./featured-table";

export default function FeaturedProductPage() {
	return (
		<div className="space-y-4">
			<h4>Featured Product List</h4>

			<FeaturedTable />
		</div>
	);
}
