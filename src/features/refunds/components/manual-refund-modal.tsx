"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { useRecordManualRefundMutation } from "@/features/refunds/api/refund.api";
import {
    MANUAL_REFUND_METHODS,
    manualRefundSchema,
    TManualRefundFormValues,
} from "@/features/refunds/schemas/manual-refund.schema";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import TDInput from "@/shared/form/TDInput";
import TDSelect from "@/shared/form/TDSelect";
import TDTextArea from "@/shared/form/TDTextArea";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";

/**
 * Record money an operator has ALREADY handed back outside the gateway — cash
 * returned on a cancelled cash-on-delivery parcel, or a bank transfer.
 *
 * Nothing is sent from here: the refund is stored as SUCCEEDED and the
 * payment's refunded total is recomputed. Tying it to a parcel (the usual
 * case) also stops a second refund being recorded against that parcel.
 */
export default function ManualRefundModal({
    orderId,
    vendorOrderId,
    parcelLabel,
    suggestedAmount,
    refundable,
    open,
    onOpenChange,
}: {
    orderId: string;
    vendorOrderId?: string;
    /** e.g. "ORD-…-V01 · Urban Threads" */
    parcelLabel: string;
    suggestedAmount: number;
    /** What is still unrefunded on the payment. */
    refundable: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [recordRefund, { isLoading }] = useRecordManualRefundMutation();

    const form = useForm({
        resolver: zodResolver(manualRefundSchema(refundable)),
        defaultValues: {
            amount: Math.min(suggestedAmount, refundable),
            method: "cash",
            reason: "",
        },
    });

    const handleSubmit = async (values: TManualRefundFormValues) => {
        try {
            await recordRefund({ orderId, vendorOrderId, ...values }).unwrap();
            toast.success("Refund recorded");
            onOpenChange(false);
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not record the refund"));
        }
    };

    return (
        <TDModal
            open={open}
            onOpenChange={onOpenChange}
            title="Record a manual refund"
            description={parcelLabel}
        >
            <Form {...form}>
                <form
                    className="space-y-5"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <div className="grid grid-cols-2 gap-x-5">
                        <TDInput
                            form={form}
                            name="amount"
                            label="Amount returned"
                            type="number"
                            required
                        />
                        <TDSelect
                            form={form}
                            name="method"
                            label="Returned by"
                            options={MANUAL_REFUND_METHODS}
                            required
                        />
                    </div>
                    <p className="-mt-3 text-xs text-muted-foreground">
                        {currencyFormatter(refundable)} of this payment is
                        still unrefunded.
                    </p>
                    <TDTextArea
                        form={form}
                        name="reason"
                        label="Reason"
                        placeholder="e.g. Cash returned to the buyer at the door"
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        Only record money that has already gone back. This
                        cannot be undone from the dashboard.
                    </p>
                    {/* Backend BE-50: payouts require the order to be PAID,
                        and any refund makes it PARTIALLY_REFUNDED. */}
                    <p className="rounded-md bg-warning-50 p-3 text-xs text-warning-600">
                        The order becomes part-refunded, which currently holds
                        back payout on every parcel in it, not just this one.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <TDButton type="submit" isLoading={isLoading}>
                            Record refund
                        </TDButton>
                    </div>
                </form>
            </Form>
        </TDModal>
    );
}
