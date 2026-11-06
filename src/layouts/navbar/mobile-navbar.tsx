import { Menu, Search, ShoppingBasket, User, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Container from "@/shared/components/container";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

import { useNavbarSearch } from "./use-navbar-search";

export default function MobileNavbar({
	cartQuantity = 0,
}: {
	cartQuantity: number;
}) {
	const [isSearched, setIsSearched] = useState(false);

	// Submitting navigates away from the panel, so close it on the way out —
	// otherwise it stays draped over the results the shopper just asked for.
	const { query, setQuery, handleSubmit } = useNavbarSearch(() =>
		setIsSearched(false),
	);

	return (
		<nav className="border-b relative">
			<Container className="flex items-center justify-between  h-20">
				<div className="flex items-center gap-x-4">
					<Menu className="hover:text-accent/80" />

					{/* A click handler on the bare SVG left the only route to
					    mobile search unreachable by keyboard. */}
					<button
						type="button"
						aria-label="Open search"
						aria-expanded={isSearched}
						onClick={() => setIsSearched(true)}
						className="cursor-pointer"
					>
						<Search className="hover:text-accent/80 hover:scale-110 duration-200" />
					</button>
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
							{cartQuantity}
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
					className="absolute top-20 left-0 right-0 h-20  border-b z-50 bg-gray-100"
				>
					<div className="h-full flex items-center justify-between gap-x-5 p-5 z-50">
						{/* Escape-to-close listens on the form so it catches the key from
							the input inside it; the form itself is not a click target. */}
						{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
						<form
							role="search"
							onSubmit={handleSubmit}
							onKeyDown={(event) => {
								if (event.key === "Escape")
									setIsSearched(false);
							}}
							className="flex flex-1 items-center ring ring-primary/30 rounded-md justify-between "
						>
							<input
								type="search"
								name="search"
								aria-label="Search products"
								// The panel only exists because the shopper just
								// tapped the search icon, so the keyboard should
								// already be up by the time it lands.
								// eslint-disable-next-line jsx-a11y/no-autofocus -- opened by the user's tap on the search icon
								autoFocus
								value={query}
								onChange={(event) =>
									setQuery(event.target.value)
								}
								className="w-full outline-0 border-0 pl-4 py-2 text-primary text-base  placeholder:text-primary/80 placeholder:text-sm placeholder:font-medium placeholder:tracking-wider"
								placeholder="Search products..."
							/>

							<Button type="submit" size={"lg"}>
								Search
							</Button>
						</form>
						<Button
							size={"lg"}
							variant={"outline"}
							aria-label="Close search"
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
