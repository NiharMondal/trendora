"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useUpdateVendorOrderStatusMutation } from "@/features/vendors/api/vendor-order.api";
import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

/**
 * Buyer-side cancellation of ONE parcel.
 *
 * Shares `PATCH /orders/vendor-orders/:id/status` with fulfilment; the backend
 * only lets a buyer take a PENDING parcel to CANCELED, so the trigger is hidden
 * otherwise. A paid parcel is refunded automatically — no separate call.
 */
export default function CancelParcelModal({
    vendorOrder,
}: {
    vendorOrder: TVendorOrder;
}) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [updateStatus, { isLoading }] = useUpdateVendorOrderStatusMutation();

    if (vendorOrder.orderStatus !== "PENDING") return null;

    const handleCancel = async () => {
        try {
            await updateStatus({
                vendorOrderId: vendorOrder.id,
                payload: {
                    orderStatus: "CANCELED",
                    cancelReason: reason.trim() || undefined,
                },
            }).unwrap();
            toast.success("Parcel cancelled");
            setOpen(false);
        } catch (error: unknown) {
            // A 403 here names the current status — the seller got there first.
            const message = (error as { data?: { message?: string } })?.data
                ?.message;
            toast.error(message ?? "Could not cancel this parcel");
        }
    };

    return (
        <TDModal
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) setReason("");
            }}
            title="Cancel this parcel?"
            description={`Parcel #${vendorOrder.vendorOrderNumber} from ${vendorOrder.vendor?.storeName ?? "this store"}`}
            trigger={
                <Button size="sm" variant="outline" className="text-destructive">
                    Cancel parcel
                </Button>
            }
        >
            <div className="space-y-4">
                <Textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Optional — tell the store why"
                    maxLength={500}
                    rows={3}
                />
                <p className="text-xs text-muted-foreground">
                    Only this store&apos;s items are cancelled; parcels from
                    other stores on the order carry on. If you paid by card, the
                    amount for this parcel is refunded automatically.
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Keep parcel
                    </Button>
                    <TDButton
                        variant="destructive"
                        isLoading={isLoading}
                        onClick={handleCancel}
                    >
                        Cancel parcel
                    </TDButton>
                </div>
            </div>
        </TDModal>
    );
}
