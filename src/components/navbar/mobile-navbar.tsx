import { Menu, Search, ShoppingBasket, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import Container from "../common/container";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { motion } from "motion/react";

export default function MobileNavbar() {
	const [isSearched, setIsSearched] = useState(false);

	return (
		<nav className="border-b relative">
			<Container className="flex items-center justify-between  h-20">
				<div className="flex items-center gap-x-4">
					<Menu className="hover:text-accent/80" />

					<Search
						className="hover:text-accent/80 hover:scale-110 duration-200 cursor-pointer"
						onClick={() => setIsSearched(true)}
					/>
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
					<div className="relative">
						<ShoppingBasket className="hover:text-accent/80 hover:scale-110 duration-200" />
						<Badge
							className="text-accent/90 size-5 rounded-full border-none absolute -top-2 -right-4"
							variant={"outline"}
						>
							4
						</Badge>
					</div>
					<User className="hover:text-accent/80 hover:scale-110 duration-200" />
				</div>
			</Container>
			{isSearched && (
				<motion.div
					initial={{
						y: -200,
						opacity: 0,
						transition: {
							duration: 2,
							type: "spring",
							bounceStiffness: 20,
						},
					}}
					animate={{ y: 0, opacity: 1 }}
					className="absolute top-20 left-0 right-0 h-20  border-b"
				>
					<div className="h-full flex items-center justify-between gap-x-5 p-5">
						<div className="flex flex-1 items-center ring ring-primary/30 rounded-md justify-between ">
							<input
								type="text"
								className="w-full outline-0 border-0 pl-4 py-2 text-primary text-base  placeholder:text-primary/80 placeholder:text-sm placeholder:font-medium placeholder:tracking-wider"
								placeholder="Search products..."
							/>

							<Button size={"lg"}>Search</Button>
						</div>
						<Button
							size={"lg"}
							variant={"outline"}
							className="size-10 rounded-full"
							onClick={() => setIsSearched(false)}
						>
							<X size={40} />
						</Button>
					</div>
				</motion.div>
			)}
		</nav>
	);
}
