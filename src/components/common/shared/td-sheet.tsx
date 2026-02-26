import React, { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useIsDesktop } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type TDSheetProps = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	title?: string;
	className?: string;
	sheetWidth?: string;
	sheetHeight?: string;
	children: React.ReactNode;
};
export default function TDSheet({
	isOpen,
	setIsOpen,
	title = "Title",
	className,
	sheetWidth,
	sheetHeight,
	children,
}: TDSheetProps) {
	const isDesktop = useIsDesktop();

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetContent
				side={!isDesktop ? "bottom" : "right"}
				className={cn(
					"[&>button]:hidden",
					{ "min-w-2xl": isDesktop },
					{ "min-h-4/5 rounded-t-lg": !isDesktop },
					isDesktop && sheetWidth && `w-${sheetWidth}`,
					!isDesktop && sheetHeight && `h-${sheetHeight}`,
				)}
			>
				<SheetHeader className=" flex flex-row items-center justify-between gap-x-5 border-b border-muted pb-4">
					<SheetTitle className="text-2xl w-fit">{title}</SheetTitle>
					<SheetDescription className="sr-only"></SheetDescription>
					<Button
						className="bg-muted hover:bg-muted rounded-full text-muted-foreground hover:text-destructive scale-120 hover:rotate-90"
						onClick={() => setIsOpen(false)}
						variant={"link"}
						size={"icon-sm"}
					>
						<X />
					</Button>
				</SheetHeader>
				<div className="px-4">{children}</div>
			</SheetContent>
		</Sheet>
	);
}
