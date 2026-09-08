"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useUpdateVendorOrderStatusMutation } from "@/features/vendors/api/vendor-order.api";
import { vendorOrderStatusSchema } from "@/features/vendors/schemas/vendor-form.schema";
import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import type { TOrderStatus } from "@/features/orders/types/status.types";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import TDInput from "@/shared/form/TDInput";
import TDTextArea from "@/shared/form/TDTextArea";
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";

/**
 * Advance one parcel through the fulfilment state machine.
 *
 * The allowed transitions mirror the backend
 * (`src/helpers/allowedTransition.ts`) so the UI cannot offer a move that will
 * be rejected. Note a vendor may NOT cancel a shipped parcel — that is a
 * refund dispute and is admin-only — so CANCELED disappears from the options
 * once the parcel has shipped.
 */
const VENDOR_TRANSITIONS: Record<TOrderStatus, TOrderStatus[]> = {
    PENDING: ["PROCESSING", "CANCELED"],
    PROCESSING: ["SHIPPED", "CANCELED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELED: [],
};

const LABELS: Record<TOrderStatus, string> = {
    PENDING: "Pending",
    PROCESSING: "Mark as processing",
    SHIPPED: "Mark as shipped",
    DELIVERED: "Mark as delivered",
    CANCELED: "Cancel this parcel",
};

export default function VendorOrderStatusModal({
    vendorOrder,
    nextStatus,
    open,
    onOpenChange,
}: {
    vendorOrder: TVendorOrder;
    nextStatus: TOrderStatus | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [updateStatus, { isLoading }] = useUpdateVendorOrderStatusMutation();

    const form = useForm({
        resolver: zodResolver(vendorOrderStatusSchema),
        defaultValues: {
            orderStatus: (nextStatus ?? "PROCESSING") as TOrderStatus,
            trackingNumber: vendorOrder.trackingNumber ?? "",
            carrier: vendorOrder.carrier ?? "",
            cancelReason: "",
        },
    });

    if (!nextStatus) return null;

    const isShipping = nextStatus === "SHIPPED";
    const isCancelling = nextStatus === "CANCELED";

    const handleSubmit = async (
        values: Parameters<typeof updateStatus>[0]["payload"],
    ) => {
        try {
            await updateStatus({
                vendorOrderId: vendorOrder.id,
                payload: {
                    // The status comes from the button that opened the modal,
                    // not from the form, so it cannot drift.
                    orderStatus: nextStatus,
                    trackingNumber: isShipping
                        ? values.trackingNumber || undefined
                        : undefined,
                    carrier: isShipping ? values.carrier || undefined : undefined,
                    cancelReason: isCancelling
                        ? values.cancelReason || undefined
                        : undefined,
                },
            }).unwrap();

            toast.success("Order updated");
            onOpenChange(false);
        } catch (error: unknown) {
            const message = (error as { data?: { message?: string } })?.data
                ?.message;
            toast.error(message ?? "Could not update this order");
        }
    };

    return (
        <TDModal
            open={open}
            onOpenChange={onOpenChange}
            title={LABELS[nextStatus]}
            description={`Parcel #${vendorOrder.vendorOrderNumber}`}
        >
            <Form {...form}>
                <form
                    className="space-y-5"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    {isShipping && (
                        <>
                            <TDInput
                                form={form}
                                name="carrier"
                                label="Carrier"
                                placeholder="Pathao, Sundarban, DHL…"
                            />
                            <TDInput
                                form={form}
                                name="trackingNumber"
                                label="Tracking number"
                                placeholder="TRK-123456"
                            />
                            <p className="text-xs text-muted-foreground">
                                The buyer sees these on their order.
                            </p>
                        </>
                    )}

                    {isCancelling && (
                        <>
                            <TDTextArea
                                form={form}
                                name="cancelReason"
                                label="Why are you cancelling?"
                                placeholder="Out of stock, cannot ship to this address…"
                            />
                            <p className="text-xs text-muted-foreground">
                                Stock for this parcel goes back to your
                                inventory, and the buyer is refunded for it.
                                Their other parcels are unaffected.
                            </p>
                        </>
                    )}

                    {!isShipping && !isCancelling && (
                        <p className="text-sm text-muted-foreground">
                            This tells the buyer their parcel is
                            {nextStatus === "PROCESSING"
                                ? " being prepared."
                                : " with them."}
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <TDButton
                            type="submit"
                            isLoading={isLoading}
                            variant={isCancelling ? "destructive" : "default"}
                        >
                            Confirm
                        </TDButton>
                    </div>
                </form>
            </Form>
        </TDModal>
    );
}

export { VENDOR_TRANSITIONS, LABELS as STATUS_ACTION_LABELS };
