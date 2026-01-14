import React, { Dispatch, SetStateAction } from "react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useIsDesktop } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { X } from "lucide-react";

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
                side={isDesktop ? "bottom" : "right"}
                className={cn(
                    "w-full [&>button]:hidden",
                    {
                        "min-h-[576px]": isDesktop,
                    },
                    className
                )}
            >
                <SheetHeader className=" flex flex-row items-center justify-between gap-x-5 pb-1 border-b border-muted pb-4">
                    <SheetTitle className="text-2xl w-fit">{title}</SheetTitle>
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
