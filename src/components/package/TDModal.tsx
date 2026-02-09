import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type TTDModalProps = {
    children: ReactNode;
    title: string;
    description?: string;
    trigger?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function TDModal({
    children,
    title,
    description,
    trigger,
    open,
    onOpenChange,
}: TTDModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent
                className="sm:max-w-sm"
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
