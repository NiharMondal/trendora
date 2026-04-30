"use client";

import {
    BadgeCheck,
    ChevronsUpDown,
    Home,
    LogOut,
    ShoppingCart,
} from "lucide-react";

import TDButton from "@/components/common/shared/td-button";
import { TUserSession } from "@/components/types/session.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { EnumUserRole } from "@/global/user-role";
import { signOut } from "next-auth/react";
import Link from "next/link";
type TNavUserProps = {
    user: TUserSession | undefined;
    role: EnumUserRole;
    userImage: string;
};
export function NavUser({ user, role, userImage }: TNavUserProps) {
    const { isMobile } = useSidebar();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-full">
                                <AvatarImage
                                    className="object-center object-cover"
                                    src={user?.image || userImage}
                                    alt={user?.name}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {user?.name.slice(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user?.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-full">
                                    <AvatarImage
                                        className="object-center object-cover"
                                        src={user?.image || userImage}
                                        alt={user?.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        CN
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user?.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={"/"}
                                    className="w-full cursor-pointer group"
                                >
                                    <Home className="group-hover:text-gray-50" />
                                    Home
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={"/cart"}
                                    className="w-full cursor-pointer group"
                                >
                                    <ShoppingCart className="group-hover:text-gray-50" />
                                    Cart
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={
                                        role === EnumUserRole.ADMIN
                                            ? "/admin/profile"
                                            : "/dashboard/profile"
                                    }
                                    className="w-full cursor-pointer group"
                                >
                                    <BadgeCheck className="group-hover:text-gray-50" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <TDButton
                                onClick={handleSignOut}
                                variant="outline"
                                className="group w-full text-white bg-destructive/90! hover:bg-destructive! hover:text-destructive-foreground! cursor-pointer"
                            >
                                <LogOut className="group-hover:text-destructive-foreground!" />
                                Log out
                            </TDButton>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
