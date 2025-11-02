import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Bell } from "lucide-react";
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<section className="w-full">
				<div className="flex items-center justify-between border-b py-5 md:px-2 pr-2 text-foreground/70 sticky top-0 right-0 bg-white z-20">
					<SidebarTrigger className="cursor-pointer" />
					<div className="">
						<input
							type="text"
							placeholder="Search anything..."
							className="outline-none border-none ring ring-neutral-dark/20 focus:ring-2 focus:ring-accent/50 rounded-full px-4 py-2 xl:min-w-xl"
						/>
					</div>
					<div className="flex items-center gap-x-4 xl:gap-x-10">
						<Bell />
						<div>
							<p>Your Balance</p>
							<p>
								<strong>$12627</strong>
							</p>
						</div>
					</div>
				</div>
				<div className="p-5 bg-neutral-light">{children}</div>
			</section>
		</SidebarProvider>
	);
}
