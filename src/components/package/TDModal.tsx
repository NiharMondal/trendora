import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type TTDModalProps = {
    children: ReactNode;
    title: string;
    description?: string;
    trigger?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
};

export function TDModal({
    children,
    title,
    description,
    trigger,
    open,
    onOpenChange,
    className,
}: TTDModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent
                className={cn("sm:max-w-sm md:max-w-md lg:max-w-lg", className)}
                onClick={(e) => e.stopPropagation()}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                {children}
            </DialogContent>
        </Dialog>
    );
}
