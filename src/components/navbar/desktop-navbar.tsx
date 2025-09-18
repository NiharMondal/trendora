import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DesktopNavbar() {
	const [focused, setFocused] = useState(false);

	return (
		<nav className="flex items-center justify-between h-20">
			<Link href={"/"}>
				<Image
					src={"/logo.png"}
					height={40}
					width={130}
					alt="Logo"
					className="h-20 w-[130px] hover:scale-105 duration-300"
				/>
			</Link>
			<div className="flex items-center bg-white h-10 ring ring-primary/30 rounded-full justify-between min-w-md">
				<input
					type="text"
					className="outline-0 border-0 pl-4 text-primary w-full text-base  placeholder:text-primary/80 placeholder:text-sm placeholder:font-medium placeholder:tracking-wider"
					placeholder="Search products..."
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
				/>
				{focused ? (
					<Button className="h-10 min-w-[40px] rounded-full ">
						<div className="flex items-center gap-x-2">
							<Search /> <span className="mb-0.5">Search</span>
						</div>
					</Button>
				) : (
					<Button className="size-10 rounded-full ">
						<Search />
					</Button>
				)}
			</div>

			<div className="flex gap-x-5">
				<Button
					size={"lg"}
					variant={"ghost"}
					className="cursor-pointer hover:bg-gray-200 hover:text-black"
				>
					<Link href={"/cart"}>
						<ShoppingBag />
					</Link>
				</Button>

				<Button size={"lg"} className="cursor-pointer">
					Login
				</Button>
			</div>
		</nav>
	);
}
