import { cn } from "@/lib/utils";
import React from "react";
import { AUTH_NAV_HEIGHT } from "..";
import Container from "@/components/common/container";
import Link from "next/link";

export default function AuthNavbar() {
    return (
        <div
            className={cn(
                AUTH_NAV_HEIGHT,
                "flex items-center border-b bg-background px-4 sm:px-0"
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
