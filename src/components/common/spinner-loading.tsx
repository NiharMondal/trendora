import { cn } from "@/lib/utils";
import React from "react";
import { Spinner } from "../ui/spinner";
type SpinnerLoadingProps = {
	className?: string;
};
export default function SpinnerLoading({ className }: SpinnerLoadingProps) {
	return (
		<div
			className={cn("flex items-center justify-center py-10", className)}
		>
			<Spinner className="size-6" />
		</div>
	);
}
