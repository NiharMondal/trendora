import React from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    isLoading?: boolean;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
};

export default function TDButton({
    children,
    className,
    size = "default",
    variant = "default",
    isLoading = false,
    ...props
}: Props) {
    const isDisabled = props.disabled || isLoading;
    return (
        <div className={cn({ "cursor-not-allowed": isDisabled })}>
            <Button
                {...props}
                size={size}
                variant={variant}
                disabled={isDisabled}
                className={cn(
                    "flex items-center gap-2",
                    { "opacity-50 pointer-events-none": isDisabled },
                    className
                )}
            >
                {isLoading && <Spinner />}
                {children}
            </Button>
        </div>
    );
}
