"use client";

import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

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
import { useAppDispatch } from "@/redux/redux.hooks";
import { logout } from "@/redux/slice/authSlice";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
type TNavUserProps = {
    user: TUserSession | undefined;
    role: EnumUserRole;
    userImage: string;
};
export function NavUser({ user, role, userImage }: TNavUserProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { isMobile } = useSidebar();

    const handleSignOut = async () => {
        await signOut();
        dispatch(logout());
        router.push("/login");
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
                                className="group w-full hover:bg-destructive! hover:text-destructive-foreground! cursor-pointer"
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
