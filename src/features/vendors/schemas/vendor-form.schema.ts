import z from "zod";

/** Cloudinary temp-folder handshake payload — see TDImageUpload. */
const imageSchema = z.object({
    url: z.url({ error: "Provide a valid URL" }),
    publicId: z.string().trim(),
});

const money = z.coerce
    .number({ error: "Enter an amount" })
    .min(0, "Cannot be negative");

/**
 * The seller application (`POST /vendors/apply`).
 *
 * Deliberately has no `status`, `slug` or `commissionRate` — approval and the
 * platform's cut are admin decisions, and sending them is pointless because
 * the backend ignores them.
 */
export const vendorApplySchema = z.object({
    storeName: z
        .string({ error: "Store name is required" })
        .trim()
        .min(3, "Store name must be at least 3 characters")
        .max(60, "Store name must be at most 60 characters"),
    description: z
        .string()
        .trim()
        .min(30, "Tell shoppers about your store in at least 30 characters")
        .max(1000, "Description is too long")
        .optional(),
    businessEmail: z.email({ error: "A valid business email is required" }),
    businessPhone: z
        .string({ error: "Business phone is required" })
        .trim()
        .min(6, "Business phone looks too short"),
    taxId: z.string().trim().max(60).optional(),
    logo: imageSchema.optional(),
    banner: imageSchema.optional(),
});
export type TVendorApplyFormValues = z.infer<typeof vendorApplySchema>;

/** What a vendor may change about their own store (`PATCH /vendors/me`). */
export const storeSettingsSchema = z.object({
    storeName: z.string().trim().min(3).max(60),
    description: z
        .string()
        .trim()
        .min(30, "Description must be at least 30 characters")
        .max(1000)
        .optional(),
    businessEmail: z.email({ error: "A valid business email is required" }),
    businessPhone: z.string().trim().min(6, "Business phone looks too short"),
    taxId: z.string().trim().max(60).optional(),
    logo: imageSchema.optional(),
    banner: imageSchema.optional(),
    /** The store's own delivery pricing — this is what checkout charges. */
    shippingFee: money,
    freeShippingThreshold: money,
});
export type TStoreSettingsFormValues = z.infer<typeof storeSettingsSchema>;

/** Admin-only commercial terms (`PATCH /vendors/:id/settings`). */
export const vendorSettingsSchema = z.object({
    /** A fraction, not a percentage: 0.1 means 10%. */
    commissionRate: z.coerce
        .number({ error: "Commission rate is required" })
        .min(0, "Commission cannot be negative")
        .max(1, "Commission is a fraction — 0.1 means 10%"),
    shippingFee: money.optional(),
    freeShippingThreshold: money.optional(),
});
export type TVendorSettingsFormValues = z.infer<typeof vendorSettingsSchema>;

export const vendorReasonSchema = z.object({
    reason: z
        .string({ error: "A reason is required" })
        .trim()
        .min(10, "Give a reason of at least 10 characters")
        .max(500, "Reason is too long"),
});
export type TVendorReasonFormValues = z.infer<typeof vendorReasonSchema>;

/** Fulfilment update on one vendor order. */
export const vendorOrderStatusSchema = z.object({
    orderStatus: z.enum([
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELED",
    ]),
    trackingNumber: z.string().trim().max(120).optional(),
    carrier: z.string().trim().max(80).optional(),
    cancelReason: z.string().trim().max(500).optional(),
});
export type TVendorOrderStatusFormValues = z.infer<
    typeof vendorOrderStatusSchema
>;

/** Buyer rating a store after delivery. */
export const vendorReviewSchema = z.object({
    vendorOrderId: z.string().min(1),
    // Plain number, not z.coerce — TDRating hands react-hook-form a number
    // already, and this matches features/reviews/schemas/review-form.schema.ts.
    rating: z.number().min(1, "Min value is 1").max(5, "Max value is 5"),
    comment: z.string().trim().min(5).max(400).optional(),
});
export type TVendorReviewFormValues = z.infer<typeof vendorReviewSchema>;
