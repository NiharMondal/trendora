import React, { Dispatch, SetStateAction } from "react";

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
import { Button } from "../ui/button";

type TDSheetProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    title?: string;
    children: React.ReactNode;
    icon?: React.ReactElement;
    trigger?: string;
    className?: string;
};
export default function TDSheet({
    isOpen,
    setIsOpen,
    children,
    title,
    className,
}: TDSheetProps) {
    const isDesktop = useIsDesktop();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent
                side={!isDesktop ? "bottom" : "right"}
                className={cn(
                    "w-full min-w-2xl [&>button]:hidden",
                    {
                        "max-h-4/5 pb-10 rounded-t-xl": !isDesktop,
                    },
                    className,
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
