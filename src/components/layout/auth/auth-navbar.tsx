import Container from "@/components/common/shared/container";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AUTH_NAV_HEIGHT } from "./constant";

export default function AuthNavbar() {
	return (
		<div
			className={cn(
				AUTH_NAV_HEIGHT,
				"flex items-center border-b bg-background px-4 sm:px-0",
			)}
		>
			<Container>
				<Link href={"/"} className="font-bold text-2xl">
					Trendora
				</Link>
			</Container>
		</div>
	);
}
