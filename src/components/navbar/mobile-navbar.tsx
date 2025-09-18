import { Menu, Search, ShoppingBasket, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Badge } from "../ui/badge";

export default function MobileNavbar() {
	const [isSearched, setIsSearched] = useState(false);

	return (
		<nav className="flex items-center justify-between border-b h-20">
			<div className="flex items-center gap-x-4">
				<Menu className="hover:text-accent/80" />
				<Search className="hover:text-accent/80 hover:scale-110 duration-200 cursor-pointer" />
			</div>
			<Link href={"/"}>
				<Image
					src={"/logo.png"}
					height={40}
					width={130}
					alt="Logo"
					className="h-20 w-[130px] hover:scale-105 duration-300"
				/>
			</Link>
			<div className="flex gap-x-4">
				<User className="hover:text-accent/80 hover:scale-110 duration-200" />
				<div className="relative">
					<ShoppingBasket className="hover:text-accent/80 hover:scale-110 duration-200" />
					<Badge
						className="text-accent/90 size-5 rounded-full border-none absolute -top-2 -right-4"
						variant={"outline"}
					>
						4
					</Badge>
				</div>
			</div>
		</nav>
	);
}
