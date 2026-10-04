import { Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Container from "@/shared/components/container";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

import { useNavbarSearch } from "./use-navbar-search";

export default function DesktopNavbar({
    cartQuantity = 0,
}: {
    cartQuantity: number;
}) {
    const [focused, setFocused] = useState(false);
    const { query, setQuery, handleSubmit } = useNavbarSearch();

    return (
        <nav className="border-b h-20">
            <Container className="flex items-center justify-between h-full">
                <Link href={"/"} className="-ml-5">
                    <Image
                        src={"/logo.png"}
                        height={40}
                        width={130}
                        alt="Logo"
                        className="h-20 w-[130px] hover:scale-105 duration-300"
                    />
                </Link>
                <form
                    role="search"
                    onSubmit={handleSubmit}
                    className="flex items-center bg-white h-10 ring ring-primary/30 rounded-full justify-between min-w-md"
                >
                    <input
                        type="search"
                        name="search"
                        aria-label="Search products"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="outline-0 border-0 pl-4 text-primary w-full text-base  placeholder:text-primary/80 placeholder:text-sm placeholder:font-medium placeholder:tracking-wider"
                        placeholder="Search products..."
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />
                    {/* `preventDefault` on mousedown keeps the input focused
                        through the click. Without it the press blurs the input,
                        the button collapses from ~110px to 40px *between*
                        mousedown and mouseup, and the mouseup lands outside the
                        button — so clicking Search did nothing at all. */}
                    <Button
                        type="submit"
                        aria-label="Search"
                        onMouseDown={(event) => event.preventDefault()}
                        className={cn(
                            "h-10 rounded-full",
                            focused ? "gap-x-2 px-4" : "size-10",
                        )}
                    >
                        <Search />
                        {focused && <span className="mb-0.5">Search</span>}
                    </Button>
                </form>

                <div className="flex items-center gap-x-10">
                    <div className="relative">
                        <Link href="/cart">
                            <ShoppingCart className="hover:text-accent/80 hover:scale-110 duration-200" />
                        </Link>
                        <Badge
                            className="text-accent/90 size-5 rounded-full border-none absolute -top-1 -right-4"
                            variant={"outline"}
                        >
                            {cartQuantity}
                        </Badge>
                    </div>

                    <Button asChild className="px-8">
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </Container>
        </nav>
    );
}
