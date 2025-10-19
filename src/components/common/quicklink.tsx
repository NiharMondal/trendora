"use client";
import Link from "next/link";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Container from "./container";
import { usePathname } from "next/navigation";

function formatSegment(segment: string) {
	return segment
		.replace(/-/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}
export function QuickLink() {
	const pathname = usePathname(); // e.g. "/settings/my-profile"
	const segments = pathname.split("/").filter(Boolean);

	return (
		<Container className=" py-5">
			<Breadcrumb>
				<BreadcrumbList className="flex items-center">
					{/* Home */}
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/">Home</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>

					{segments.map((segment, index) => {
						const href =
							"/" + segments.slice(0, index + 1).join("/");
						const isLast = index === segments.length - 1;

						return (
							<div key={href} className="flex items-center">
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									{isLast ? (
										<BreadcrumbPage>
											{formatSegment(segment)}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link href={href}>
												{formatSegment(segment)}
											</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</div>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</Container>
	);
}
