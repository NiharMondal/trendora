import { cn } from "@/lib/utils";
import React from "react";

type BigContainerProps = {
	children: React.ReactNode;
	className?: string;
};

export default function BigContainer({
	children,
	className,
}: BigContainerProps) {
	return <div className={cn("px-5 xl:px-14", className)}>{children}</div>;
}
