import React from "react";
import { Search, User2, Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import TopBar from "./top-bar";
import Container from "../common/container";
import BigContainer from "../common/big-container";
import Link from "next/link";
import Image from "next/image";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
const navItems = [
	{ path: "/", label: "Home" },
	{ path: "/men", label: "Men's" },
	{ path: "/women", label: "Women's" },
	{ path: "/kids", label: "Kid's" },
	{ path: "/accessories", label: "Accessories" },
];
export default function Navbar() {
	return (
		<header>
			<BigContainer>
				<TopBar />
				<nav className=" flex items-center justify-between">
					<ul className="flex items-center gap-x-5">
						<li className="-ml-5 overflow-hidden">
							<Link href={"/"}>
								<Image
									src={"/logo.png"}
									height={40}
									width={130}
									alt="Logo"
									className="h-20 w-[130px] hover:scale-105 duration-300"
								/>
							</Link>
						</li>
						{navItems.map((item) => (
							<li key={item.label}>
								<Link
									href={item.path}
									className="relative font-semibold hover:text-primary duration-300 link_style"
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
					<ul className="flex items-center gap-x-4 *:text-muted">
						<li>
							<Tooltip>
								<TooltipTrigger>
									<Search className="cursor-pointer hover:text-primary/80 hover:duration-300" />
								</TooltipTrigger>
								<TooltipContent>
									<p className="font-mono tracking-wider">
										Search
									</p>
								</TooltipContent>
							</Tooltip>
						</li>
						<li>
							<Popover>
								<PopoverTrigger>
									<Tooltip>
										<TooltipTrigger asChild>
											<User2 className="cursor-pointer hover:text-primary/80 hover:duration-300" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="font-mono tracking-wider">
												My Account
											</p>
										</TooltipContent>
									</Tooltip>
								</PopoverTrigger>
								<PopoverContent className="max-w-[200px]">
									<ul className="px-5 py-3 space-y-1.5 ">
										<li className="cursor-pointer hover:text-primary/70 tracking-wide">
											<Link href={"/login"}>Sign In</Link>
										</li>
										<li className="cursor-pointer hover:text-primary/70 tracking-wide">
											<Link href={"/register"}>
												Register
											</Link>
										</li>
										<li className="cursor-pointer hover:text-primary/70 tracking-wide">
											<Link href={"/cart"}>
												View Cart
											</Link>
										</li>
									</ul>
								</PopoverContent>
							</Popover>
						</li>
						<li>
							<Tooltip>
								<TooltipTrigger>
									<Link href={"/dashboard/wishlist"}>
										<Heart className="cursor-pointer hover:text-primary/80 hover:duration-300" />
									</Link>
								</TooltipTrigger>
								<TooltipContent>
									<p className="font-mono tracking-wider">
										Wishlist
									</p>
								</TooltipContent>
							</Tooltip>
						</li>
						<li>
							<Tooltip>
								<TooltipTrigger>
									<Link href={"/cart"}>
										<ShoppingCart className="cursor-pointer hover:text-primary/80 hover:duration-300" />
									</Link>
								</TooltipTrigger>
								<TooltipContent>
									<p className="font-mono tracking-wider">
										Cart
									</p>
								</TooltipContent>
							</Tooltip>
						</li>
					</ul>
				</nav>
			</BigContainer>
		</header>
	);
}
