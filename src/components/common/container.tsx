import React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
};
export default function Container({ children, className }: ContainerProps) {
    return (
        <div className={cn("container mx-auto px-4 xl:px-0", className)}>
            {children}
        </div>
    );
}
