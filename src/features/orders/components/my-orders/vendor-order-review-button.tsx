"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateVendorReviewMutation } from "@/features/vendors/api/vendor.api";
import {
    TVendorReviewFormValues,
    vendorReviewSchema,
} from "@/features/vendors/schemas/vendor-form.schema";
import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import TDRating from "@/shared/form/TDRating";
import TDTextArea from "@/shared/form/TDTextArea";
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";

/**
 * Rate the STORE that fulfilled one parcel.
 *
 * Distinct from a product review: this rates the seller, and the backend only
 * accepts it once the parcel is DELIVERED and only from the buyer who ordered
 * it — one review per parcel. The button is therefore hidden until delivery.
 */
export default function VendorOrderReviewButton({
    vendorOrder,
}: {
    vendorOrder: TVendorOrder;
}) {
    const [open, setOpen] = useState(false);
    const [createReview, { isLoading }] = useCreateVendorReviewMutation();

    // No explicit generic — the repo's convention, and it keeps zod's coerced
    // input types from clashing with the resolver's output types.
    const form = useForm({
        resolver: zodResolver(vendorReviewSchema),
        defaultValues: {
            vendorOrderId: vendorOrder.id,
            rating: 5,
            comment: "",
        },
    });

    if (vendorOrder.orderStatus !== "DELIVERED") return null;

    const handleSubmit = async (values: TVendorReviewFormValues) => {
        try {
            await createReview(values).unwrap();
            toast.success("Thanks — your review helps other shoppers");
            setOpen(false);
            form.reset({ vendorOrderId: vendorOrder.id, rating: 5, comment: "" });
        } catch (error: unknown) {
            const message = (error as { data?: { message?: string } })?.data
                ?.message;
            // 409 = already reviewed. The backend allows one per parcel, and
            // there is no per-parcel "have I reviewed this" flag on the order
            // payload, so the button stays visible and the error explains it.
            toast.error(message ?? "Could not submit your review");
        }
    };

    return (
        <>
            <Button
                variant="link"
                size="sm"
                className="px-0"
                onClick={() => setOpen(true)}
            >
                <Star className="size-3.5" />
                Rate store
            </Button>

            <TDModal
                open={open}
                onOpenChange={setOpen}
                title={`Rate ${vendorOrder.vendor?.storeName ?? "this store"}`}
                description={`How was your experience with parcel #${vendorOrder.vendorOrderNumber}?`}
            >
                <Form {...form}>
                    <form
                        className="space-y-5"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <TDRating form={form} name="rating" label="Rating" required />
                        <TDTextArea
                            form={form}
                            name="comment"
                            label="Comment"
                            placeholder="Packaging, delivery speed, communication…"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <TDButton type="submit" isLoading={isLoading}>
                                Submit review
                            </TDButton>
                        </div>
                    </form>
                </Form>
            </TDModal>
        </>
    );
}
