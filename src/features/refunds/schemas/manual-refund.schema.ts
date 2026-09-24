import z from "zod";

/** The rails money can go back on outside the gateway. `gateway` on the row. */
export const MANUAL_REFUND_METHODS = [
    { label: "Cash", value: "cash" },
    { label: "Bank transfer", value: "bank_transfer" },
    { label: "Mobile money", value: "mobile_money" },
    { label: "Other", value: "other" },
];

/**
 * Money ALREADY returned by hand (`POST /refunds/manual`). The backend marks
 * it SUCCEEDED on arrival, so this records a fact rather than sending money.
 *
 * `max` is what is still unrefunded on the payment. The backend enforces the
 * same limit, so this only saves a round trip.
 */
export const manualRefundSchema = (max: number) =>
    z.object({
        amount: z.coerce
            .number({ error: "Enter an amount" })
            .positive("Amount must be greater than 0")
            .max(max, `At most ${max.toFixed(2)} of this payment is unrefunded`)
            .refine((value) => Number(value.toFixed(2)) === value, {
                message: "At most 2 decimal places",
            }),
        method: z.string({ error: "Choose how the money went back" }).min(1),
        reason: z
            .string({ error: "A reason is required" })
            .trim()
            .min(5, "Give a reason of at least 5 characters")
            .max(500),
    });

export type TManualRefundFormValues = z.infer<
    ReturnType<typeof manualRefundSchema>
>;
