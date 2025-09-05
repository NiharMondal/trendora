import React from "react";
import { Search, User2, Heart, ShoppingBag } from "lucide-react";
import TopBar from "./top-bar";
import Container from "../common/container";
import BigContainer from "../common/big-container";
import Link from "next/link";
import Image from "next/image";

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
				<nav className="sticky top-0 left-0 right-0 flex items-center justify-between">
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
					<ul className="flex items-center gap-x-4">
						<li>
							<Search />
						</li>
						<li>
							<User2 />
						</li>
						<li>
							<Heart />
						</li>
						<li>
							<ShoppingBag />
						</li>
					</ul>
				</nav>
			</BigContainer>
		</header>
	);
}
