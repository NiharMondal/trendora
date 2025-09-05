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
				"w-full px-5 sm:px-0 mx-auto sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl",
				className
			)}
		>
			{children}
		</div>
	);
}
