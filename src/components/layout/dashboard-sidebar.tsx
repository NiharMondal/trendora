"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import React, { useState } from "react";
import { adminNavlink, customerNavlink } from "./dashboard-navlink";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
	const pathname = usePathname();
	const [user, setUser] = useState("admin");
	console.log(pathname);

	let label = user === "admin" ? "Admin Dashboard" : "Customer Dashboard";
	let navLink = user === "admin" ? adminNavlink : customerNavlink;
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="mb-4">
						{label}
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navLink.map((nav) => {
								return (
									<React.Fragment key={nav.title}>
										{nav.title && nav.url ? (
											<SidebarMenuItem>
												<SidebarMenuButton
													asChild
													className={cn(
														nav.url === pathname
															? "bg-accent text-accent-foreground"
															: ""
													)}
												>
													<Link href={nav.url}>
														{nav.icon && (
															<nav.icon />
														)}
														{nav.title}
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										) : (
											<SidebarMenuItem>
												<SidebarMenuButton
													tooltip={nav.title}
												>
													{nav.icon && <nav.icon />}
													{nav.title}
												</SidebarMenuButton>
												<SidebarMenuSub>
													{nav?.children?.map(
														(sub) => (
															<SidebarMenuSubItem
																key={sub.name}
															>
																<SidebarMenuSubButton
																	href={
																		sub.url
																	}
																>
																	{sub.name}
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														)
													)}
												</SidebarMenuSub>
											</SidebarMenuItem>
										)}
									</React.Fragment>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
