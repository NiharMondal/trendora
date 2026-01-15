import { cn } from "@/lib/utils";
import React from "react";

type Props = {
    text: string;
    icon: React.ReactElement;
    iconAlign?: "left" | "right";
    className?: string;
};

export default function TextWithIcon({
    text,
    icon,
    iconAlign = "left",
    className,
}: Props) {
    return (
        <p className={cn("flex gap-x-1 items-center", className)}>
            {icon} <span>{text} </span>{" "}
            {iconAlign === "right" && <span>{icon}</span>}
        </p>
    );
}
