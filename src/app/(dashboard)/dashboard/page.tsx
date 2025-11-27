import { customerNavlink } from "@/components/layout/dashboard-navlink";
import Link from "next/link";
import React from "react";

export default function UserDashboardPage() {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
			{customerNavlink?.map((item) => (
				<div
					key={item.url}
					className="border bg-white rounded-lg hover:border hover:border-primary duration-200 h-[180px] md:h-[200px] shadow"
				>
					{item.url && (
						<Link
							href={item?.url}
							className=" p-5 flex items-center justify-center flex-col space-y-2 min-w-full min-h-full"
						>
							<span className="text-primary">
								{item.icon && <item.icon />}
							</span>
							<p className="font-normal text-lg tracking-wider">
								{item.title}
							</p>
						</Link>
					)}
				</div>
			))}
		</div>
	);
}
