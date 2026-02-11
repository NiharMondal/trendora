import { cn } from "@/lib/utils";
import React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";

interface ITDPopoverProps {
    children: React.ReactNode;
    trigger: React.ReactNode;
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    className?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
}

export default function TDPopover({
    children,
    trigger,
    align = "end",
    side = "bottom",
    sideOffset = 4,
    className,
    open,
    onOpenChange,
    modal,
}: ITDPopoverProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange} modal={modal}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent
                align={align}
                side={side}
                sideOffset={sideOffset}
                className={cn("w-72", className)}
            >
                {children}
            </PopoverContent>
        </Popover>
    );
}
