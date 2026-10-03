"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
    useRejectVendorMutation,
    useSuspendVendorMutation,
    useUpdateVendorSettingsMutation,
} from "@/features/vendors/api/vendor.api";
import {
    vendorReasonSchema,
    vendorSettingsSchema,
} from "@/features/vendors/schemas/vendor-form.schema";
import { TVendor } from "@/features/vendors/types/vendor.types";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import TDInput from "@/shared/form/TDInput";
import TDTextArea from "@/shared/form/TDTextArea";
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";

const apiMessage = (error: unknown) =>
    (error as { data?: { message?: string } })?.data?.message;

/**
 * Rejecting or suspending a store requires a reason — the seller is shown it,
 * and without one they have no way to fix the problem.
 */
export function VendorReasonModal({
    vendor,
    mode,
    open,
    onOpenChange,
}: {
    vendor: TVendor;
    mode: "reject" | "suspend";
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [rejectVendor, { isLoading: isRejecting }] = useRejectVendorMutation();
    const [suspendVendor, { isLoading: isSuspending }] =
        useSuspendVendorMutation();

    const form = useForm({
        resolver: zodResolver(vendorReasonSchema),
        defaultValues: { reason: "" },
    });

    const isReject = mode === "reject";

    const handleSubmit = async (values: { reason: string }) => {
        try {
            if (isReject) {
                await rejectVendor({ id: vendor.id, payload: values }).unwrap();
                toast.success("Application rejected");
            } else {
                await suspendVendor({ id: vendor.id, payload: values }).unwrap();
                toast.success("Store suspended");
            }
            onOpenChange(false);
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not complete that action");
        }
    };

    return (
        <TDModal
            open={open}
            onOpenChange={onOpenChange}
            title={isReject ? "Reject this application" : "Suspend this store"}
            description={vendor.storeName}
        >
            <Form {...form}>
                <form
                    className="space-y-5"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <TDTextArea
                        form={form}
                        name="reason"
                        label="Reason"
                        placeholder={
                            isReject
                                ? "What does the seller need to change before re-applying?"
                                : "Why is this store being suspended?"
                        }
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        {isReject
                            ? "The seller sees this reason and can apply again after fixing it. Their listings are unpublished."
                            : "The store's listings are hidden from shoppers immediately. Orders already in flight are left alone — buyers are still owed those."}
                    </p>
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
                            variant="destructive"
                            isLoading={isRejecting || isSuspending}
                        >
                            {isReject ? "Reject" : "Suspend"}
                        </TDButton>
                    </div>
                </form>
            </Form>
        </TDModal>
    );
}

/** Commercial terms. Only affects orders placed from now on. */
export function VendorSettingsModal({
    vendor,
    open,
    onOpenChange,
}: {
    vendor: TVendor;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [updateSettings, { isLoading }] = useUpdateVendorSettingsMutation();

    const form = useForm({
        resolver: zodResolver(vendorSettingsSchema),
        defaultValues: {
            commissionRate: Number(vendor.commissionRate),
            shippingFee: Number(vendor.shippingFee),
            freeShippingThreshold: Number(vendor.freeShippingThreshold),
        },
    });

    const handleSubmit = async (
        values: Parameters<typeof updateSettings>[0]["payload"],
    ) => {
        try {
            await updateSettings({ id: vendor.id, payload: values }).unwrap();
            toast.success("Vendor settings updated");
            onOpenChange(false);
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not update settings");
        }
    };

    return (
        <TDModal
            open={open}
            onOpenChange={onOpenChange}
            title="Commercial terms"
            description={vendor.storeName}
        >
            <Form {...form}>
                <form
                    className="space-y-5"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <TDInput
                        form={form}
                        name="commissionRate"
                        label="Commission rate (fraction)"
                        type="number"
                        placeholder="0.10"
                        required
                    />
                    <p className="text-xs text-muted-foreground -mt-3">
                        A fraction, not a percentage: 0.1 means 10%. Taken from
                        the store&apos;s merchandise subtotal.
                    </p>

                    <div className="grid grid-cols-2 gap-x-5">
                        <TDInput
                            form={form}
                            name="shippingFee"
                            label="Delivery fee"
                            type="number"
                        />
                        <TDInput
                            form={form}
                            name="freeShippingThreshold"
                            label="Free delivery over"
                            type="number"
                        />
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Only affects orders placed from now on — every existing
                        order keeps the rate it was priced with.
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
                            Save
                        </TDButton>
                    </div>
                </form>
            </Form>
        </TDModal>
    );
}
