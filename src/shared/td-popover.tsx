import { cn } from "@/lib/utils";
import React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";

type TTDPopoverProps = {
    triggerIcon: React.ReactElement;
    children: React.ReactNode;
    align?: "start" | "center" | "end";
    className?: string;
};

export default function TDPopover({
    triggerIcon,
    children,
    align = "end",
    className,
}: TTDPopoverProps) {
    return (
        <Popover>
            <PopoverTrigger>{triggerIcon}</PopoverTrigger>
            <PopoverContent align={align} className={cn("max-w-sm", className)}>
                {children}
            </PopoverContent>
        </Popover>
    );
}
