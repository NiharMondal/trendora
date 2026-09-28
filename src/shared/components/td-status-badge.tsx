import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

/**
 * Colour families for status pills. Each one is a bg / fg / border triple
 * defined as `--status-<tone>*` in `app/globals.css`, light and dark.
 */
export type TStatusTone =
    | "neutral" // nothing happening / withdrawn — draft, canceled
    | "warning" // waiting on someone — pending, in review
    | "info" // actively being worked on — processing
    | "transit" // on the move — shipped
    | "success" // done and good — delivered, paid, approved
    | "danger" // went wrong — failed, rejected
    | "alert" // blocked by a decision — suspended
    | "partial" // part-way money state — partially refunded
    | "refund" // money went back — refunded
    | "brand"; // highlighted by Trendora — featured

const TONE_CLASSES: Record<TStatusTone, { pill: string; dot: string }> = {
    neutral: {
        pill: "bg-status-neutral text-status-neutral-foreground border-status-neutral-border",
        dot: "bg-status-neutral-foreground",
    },
    warning: {
        pill: "bg-status-warning text-status-warning-foreground border-status-warning-border",
        dot: "bg-status-warning-foreground",
    },
    info: {
        pill: "bg-status-info text-status-info-foreground border-status-info-border",
        dot: "bg-status-info-foreground",
    },
    transit: {
        pill: "bg-status-transit text-status-transit-foreground border-status-transit-border",
        dot: "bg-status-transit-foreground",
    },
    success: {
        pill: "bg-status-success text-status-success-foreground border-status-success-border",
        dot: "bg-status-success-foreground",
    },
    danger: {
        pill: "bg-status-danger text-status-danger-foreground border-status-danger-border",
        dot: "bg-status-danger-foreground",
    },
    alert: {
        pill: "bg-status-alert text-status-alert-foreground border-status-alert-border",
        dot: "bg-status-alert-foreground",
    },
    partial: {
        pill: "bg-status-partial text-status-partial-foreground border-status-partial-border",
        dot: "bg-status-partial-foreground",
    },
    refund: {
        pill: "bg-status-refund text-status-refund-foreground border-status-refund-border",
        dot: "bg-status-refund-foreground",
    },
    brand: {
        pill: "bg-status-brand text-status-brand-foreground border-status-brand-border",
        dot: "bg-status-brand-foreground",
    },
};

/**
 * Every backend status value → its colour. The status unions in
 * `shared/types/status.types.ts` share values across domains (PENDING is an
 * order, payment, payout, refund, product and store state), and they mean the
 * same *kind* of thing in each, so one table colours all of them. A value not
 * listed here renders neutral.
 */
const STATUS_TONES: Record<string, TStatusTone> = {
    PENDING: "warning",
    DRAFT: "neutral",
    PROCESSING: "info",
    SHIPPED: "transit",
    DELIVERED: "success",
    CANCELED: "neutral",

    PAID: "success",
    SUCCEEDED: "success",
    COMPLETED: "success",
    FAILED: "danger",
    PARTIALLY_REFUNDED: "partial",
    REFUNDED: "refund",

    APPROVED: "success",
    REJECTED: "danger",
    SUSPENDED: "alert",

    ACTIVE: "success",
    PUBLISHED: "success",
    INACTIVE: "neutral",
    UNPUBLISHED: "neutral",
    EXPIRED: "neutral",
    FEATURED: "brand",
};

export const getStatusTone = (status?: string | null): TStatusTone =>
    (status && STATUS_TONES[status.toUpperCase()]) || "neutral";

/** "PARTIALLY_REFUNDED" → "Partially refunded" */
export const humanizeStatus = (status: string): string => {
    const words = status.toLowerCase().replace(/[_-]+/g, " ").trim();
    return words.charAt(0).toUpperCase() + words.slice(1);
};

type TDStatusBadgeProps = {
    /** The raw status value from the backend — decides the colour. */
    status?: string | null;
    /** What to show. Defaults to the status, humanized. */
    value?: ReactNode;
    /** Force a colour when the status alone would pick the wrong one. */
    tone?: TStatusTone;
    /** Small leading dot in the tone's colour. */
    dot?: boolean;
    className?: string;
};

/**
 * A status pill. Send the status and, optionally, the text:
 *
 * ```tsx
 * <TDStatusBadge status="SHIPPED" />                 // "Shipped", transit colour
 * <TDStatusBadge status="PENDING" value="Owed" />    // "Owed", warning colour
 * ```
 */
export default function TDStatusBadge({
    status,
    value,
    tone,
    dot = true,
    className,
}: TDStatusBadgeProps) {
    const classes = TONE_CLASSES[tone ?? getStatusTone(status)];
    const label = value ?? (status ? humanizeStatus(status) : "Unknown");

    return (
        <span
            data-slot="status-badge"
            className={cn(
                "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
                classes.pill,
                className,
            )}
        >
            {dot && (
                <span
                    aria-hidden="true"
                    className={cn("size-1.5 rounded-full", classes.dot)}
                />
            )}
            {label}
        </span>
    );
}
