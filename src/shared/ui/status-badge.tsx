import TDStatusBadge, {
    getStatusTone,
    type TStatusTone,
} from "@/shared/components/td-status-badge";

/**
 * A domain's wording for its statuses. Colour is NOT part of the map: it comes
 * from the status value itself (`getStatusTone`), so PENDING looks the same on
 * an order, a payout and a store. Set `tone` only to deliberately override it.
 */
export type TStatusBadgeConfig = {
    label: string;
    tone?: TStatusTone;
};

export type TStatusMap<T extends string> = Record<T, TStatusBadgeConfig>;

export function getStatusBadge<T extends string>(
    statusMap: TStatusMap<T>,
    status: T | undefined | null,
): Required<TStatusBadgeConfig> {
    const config = status ? statusMap[status] : undefined;
    return {
        label: config?.label ?? status ?? "Unknown",
        tone: config?.tone ?? getStatusTone(status),
    };
}

/** `TDStatusBadge` with the label looked up in a domain's status map. */
export function StatusBadge<T extends string>({
    statusMap,
    status,
    className,
}: {
    statusMap: TStatusMap<T>;
    status: T | undefined | null;
    className?: string;
}) {
    const { label, tone } = getStatusBadge(statusMap, status);

    return (
        <TDStatusBadge
            status={status}
            value={label}
            tone={tone}
            className={className}
        />
    );
}
