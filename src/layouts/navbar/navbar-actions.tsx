import {
    Heart,
    LayoutDashboard,
    LogOut,
    Package,
    ShoppingCart,
    User,
    UserCircle,
} from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { TUserSession } from "@/features/auth/types/session.types";
import { isAdminRole, roleHomePath } from "@/features/auth/utils/role-home";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Skeleton } from "@/shared/ui/skeleton";

type TNavbarActionsProps = {
    cartQuantity: number;
    /** Mobile swaps the "Login" button for an icon so it fits beside the logo. */
    compact?: boolean;
};

/** Cart link plus the signed-in avatar menu or a login entry point. */
export default function NavbarActions({
    cartQuantity,
    compact = false,
}: TNavbarActionsProps) {
    const { data: session, status } = useSession();
    const user = session?.user as TUserSession | undefined;

    return (
        <div
            className={cn(
                "flex items-center",
                compact ? "gap-x-5" : "gap-x-10",
            )}
        >
            <div className="relative">
                <Link
                    href="/cart"
                    aria-label={`Cart, ${cartQuantity} ${cartQuantity === 1 ? "item" : "items"}`}
                >
                    <ShoppingCart className="hover:text-accent/80 hover:scale-110 duration-200" />
                </Link>
                <Badge
                    aria-hidden
                    className="text-accent/90 size-5 rounded-full border-none absolute -top-1 -right-4 pointer-events-none"
                    variant={"outline"}
                >
                    {cartQuantity}
                </Badge>
            </div>

            {/* Holding the slot while the session resolves keeps a signed-in
                shopper from seeing "Login" flash on every page load. */}
            {status === "loading" ? (
                <Skeleton
                    className={cn(
                        "rounded-full",
                        compact ? "size-8" : "h-9 w-24",
                    )}
                />
            ) : user ? (
                <UserMenu user={user} />
            ) : compact ? (
                <Link href="/login" aria-label="Login">
                    <User className="hover:text-accent/80 hover:scale-110 duration-200" />
                </Link>
            ) : (
                <Button asChild className="px-8">
                    <Link href="/login">Login</Link>
                </Button>
            )}
        </div>
    );
}

function UserMenu({ user }: { user: TUserSession }) {
    const profileHref = isAdminRole(user.role)
        ? "/admin/profile"
        : "/dashboard/profile";
    const initial = user.name?.slice(0, 1).toUpperCase();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger
                aria-label="Account menu"
                className="rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
                <Avatar className="size-9 ring ring-primary/20">
                    <AvatarImage
                        className="object-center object-cover"
                        src={user.image}
                        alt=""
                    />
                    <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="grid text-sm leading-tight">
                        <span className="truncate font-medium">
                            {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {user.email}
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={roleHomePath(user.role)}>
                            <LayoutDashboard />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/my-orders">
                            <Package />
                            My Orders
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/wishlist">
                            <Heart />
                            Wishlist
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={profileHref}>
                            <UserCircle />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
