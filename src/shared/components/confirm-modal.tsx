"use client";

import { TDModal } from "@/shared/components/td-modal";
import TDButton from "@/shared/components/td-button";

type TConfirmModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    /** Destructive (red) by default — most confirmations guard a delete. */
    variant?: "destructive" | "default";
    isLoading?: boolean;
};

/**
 * A yes/no dialog. The caller owns the open state and the action, so the
 * modal can stay open with a spinner while the request runs and close only
 * once it succeeds.
 */
export default function ConfirmModal({
    open,
    onOpenChange,
    onConfirm,
    title,
    description = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "destructive",
    isLoading = false,
}: TConfirmModalProps) {
    return (
        <TDModal
            open={open}
            // Don't let a click outside dismiss it mid-request.
            onOpenChange={(next) => !isLoading && onOpenChange(next)}
            title={title}
            description={description}
        >
            <div className="flex justify-end gap-2 mt-4">
                <TDButton
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                >
                    {cancelText}
                </TDButton>
                <TDButton
                    variant={variant}
                    onClick={onConfirm}
                    isLoading={isLoading}
                >
                    {confirmText}
                </TDButton>
            </div>
        </TDModal>
    );
}
