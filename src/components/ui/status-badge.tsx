import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeConfig = {
    label: string;
    className: string;
};

type StatusMap<T extends string> = Record<T, BadgeConfig>;

export function getStatusBadge<T extends string>(
    statusMap: StatusMap<T>,
    status: T | undefined | null,
): BadgeConfig {
    if (!status || !statusMap[status]) {
        return {
            label: status ?? "Unknown",
            className:
                "bg-gray-100 text-gray-500 hover:bg-gray-100 border-gray-200",
        };
    }
    return statusMap[status];
}

export function StatusBadge<T extends string>({
    statusMap,
    status,
    className,
}: {
    statusMap: StatusMap<T>;
    status: T | undefined | null;
    className?: string;
}) {
    const config = getStatusBadge(statusMap, status);

    return (
        <Badge variant="outline" className={cn(config.className, className)}>
            {config.label}
        </Badge>
    );
}
