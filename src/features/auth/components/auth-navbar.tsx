import Link from "next/link";

import Container from "@/shared/components/container";
import { cn } from "@/shared/lib/utils";

import { AUTH_NAV_HEIGHT } from "@/features/auth/constants/auth-nav";

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
