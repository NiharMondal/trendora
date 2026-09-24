"use client";

import { Check, RotateCcw, Settings2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
    useApproveVendorMutation,
    useReinstateVendorMutation,
} from "@/features/vendors/api/vendor.api";
import { TVendor } from "@/features/vendors/types/vendor.types";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { Button } from "@/shared/ui/button";

import {
    VendorReasonModal,
    VendorSettingsModal,
} from "./vendor-action-modals";

/**
 * The moderation moves an admin can make on one store, plus its commercial
 * terms. Shared by the vendor table and the vendor detail page so the two can
 * never offer different transitions.
 *
 * `compact` renders the terms button icon-only, for a table row.
 */
export default function VendorModerationActions({
    vendor,
    compact = false,
}: {
    vendor: TVendor;
    compact?: boolean;
}) {
    const [reasonMode, setReasonMode] = useState<"reject" | "suspend" | null>(
        null,
    );
    const [showSettings, setShowSettings] = useState(false);

    const [approveVendor, { isLoading: isApproving }] =
        useApproveVendorMutation();
    const [reinstateVendor, { isLoading: isReinstating }] =
        useReinstateVendorMutation();
    const isMutating = isApproving || isReinstating;

    const handleApprove = async () => {
        try {
            await approveVendor(vendor.id).unwrap();
            toast.success(
                `${vendor.storeName} approved — the owner is now a vendor`,
            );
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not approve this store"));
        }
    };

    const handleReinstate = async () => {
        try {
            await reinstateVendor(vendor.id).unwrap();
            toast.success(
                `${vendor.storeName} reinstated — their listings stay hidden until they republish`,
            );
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, "Could not reinstate this store"),
            );
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-1">
            {/* PENDING and REJECTED are both approvable — the backend refuses
                only an already-approved store. */}
            {vendor.status !== "APPROVED" && vendor.status !== "SUSPENDED" && (
                <Button size="sm" disabled={isMutating} onClick={handleApprove}>
                    <Check className="size-3.5" />
                    Approve
                </Button>
            )}

            {vendor.status === "PENDING" && (
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setReasonMode("reject")}
                >
                    <X className="size-3.5" />
                    Reject
                </Button>
            )}

            {vendor.status === "APPROVED" && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setReasonMode("suspend")}
                >
                    Suspend
                </Button>
            )}

            {vendor.status === "SUSPENDED" && (
                <Button
                    size="sm"
                    variant="secondary"
                    disabled={isMutating}
                    onClick={handleReinstate}
                >
                    <RotateCcw className="size-3.5" />
                    Reinstate
                </Button>
            )}

            {compact ? (
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Commercial terms for ${vendor.storeName}`}
                    title="Commercial terms"
                    onClick={() => setShowSettings(true)}
                >
                    <Settings2 className="size-4" />
                </Button>
            ) : (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSettings(true)}
                >
                    <Settings2 className="size-3.5" />
                    Commercial terms
                </Button>
            )}

            {reasonMode && (
                <VendorReasonModal
                    key={`${vendor.id}-${reasonMode}`}
                    vendor={vendor}
                    mode={reasonMode}
                    open
                    onOpenChange={(open) => !open && setReasonMode(null)}
                />
            )}

            {showSettings && (
                <VendorSettingsModal
                    key={vendor.id}
                    vendor={vendor}
                    open
                    onOpenChange={setShowSettings}
                />
            )}
        </div>
    );
}
