import { Search, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Container from "../common/container";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function DesktopNavbar({
    cartQuantity = 0,
}: {
    cartQuantity: number;
}) {
    const [focused, setFocused] = useState(false);

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
                                <Search />{" "}
                                <span className="mb-0.5">Search</span>
                            </div>
                        </Button>
                    ) : (
                        <Button className="size-10 rounded-full ">
                            <Search />
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-x-10">
                    <div className="relative">
                        <Link href="/cart">
                            <ShoppingBasket className="hover:text-accent/80 hover:scale-110 duration-200" />
                        </Link>
                        <Badge
                            className="text-accent/90 size-5 rounded-full border-none absolute -top-2 -right-4"
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
