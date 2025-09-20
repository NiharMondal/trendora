import { cn } from "@/lib/utils";
import React from "react";
type ContainerProps = {
	children: React.ReactNode;
	className?: string;
};
export default function Container({ children, className }: ContainerProps) {
	return (
		<div
			className={cn(
				"w-full px-5 lg:px-0  lg:max-w-3xl xl:max-w-7xl mx-auto",
				className
			)}
		>
			{children}
		</div>
	);
}
