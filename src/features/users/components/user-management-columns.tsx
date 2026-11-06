import { Ban, EllipsisVertical, RotateCcw, UserCog } from "lucide-react";

import { DataTableColumn } from "@/shared/components/table/table-types";
import TDPopover from "@/shared/components/td-popover";
import { Button } from "@/shared/ui/button";
import TdAvatar from "@/shared/components/td-avatar";
import { formatDate } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import { TUser } from "@/features/users/types/user.types";

const ROLE_STYLES: Record<string, string> = {
    ADMIN: "bg-primary-100 text-primary-700",
    VENDOR: "bg-warning-100 text-warning-700",
    CUSTOMER: "bg-muted text-foreground/80",
};

type Props = {
    /** The signed-in admin. Their own row gets no actions — the backend
     * refuses to let an admin disable or re-role themselves. */
    currentUserId?: string;
    onDisable: (user: TUser) => void;
    onRestore: (user: TUser) => void;
    onChangeRole: (user: TUser) => void;
};

export const userManagementColumns = ({
    currentUserId,
    onDisable,
    onRestore,
    onChangeRole,
}: Props): DataTableColumn<TUser>[] => [
    {
        header: "User",
        key: "user",
        cell: (row) => (
            <div className="flex items-center gap-x-3">
                <TdAvatar
                    src={row.avatar || undefined}
                    alt={row.name}
                    fallback={row.name?.charAt(0).toUpperCase() || "U"}
                    className="border border-muted flex items-center justify-center rounded-full"
                    
                />
                
                <div className="space-y-0.5">
                    <p className="font-semibold">{row.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {row.email ?? "No login credentials"}
                    </p>
                </div>
            </div>
        ),
    },
    {
        header: "Phone",
        key: "phone",
        cell: (row) => row.phone || "-",
    },
    {
        header: "Role",
        key: "role",
        cell: (row) =>
            row.role ? (
                <span
                    className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        ROLE_STYLES[row.role] ?? ROLE_STYLES.CUSTOMER,
                    )}
                >
                    {row.role}
                </span>
            ) : (
                "-"
            ),
    },
    {
        header: "Joined",
        key: "createdAt",
        cell: (row) => formatDate(row.createdAt, "Do MMM YYYY"),
    },
    {
        header: "Actions",
        key: "actions",
        align: "right",
        cell: (row) => {
            if (row.id === currentUserId) {
                return <span className="text-xs text-muted-foreground">You</span>;
            }
            if (row.isDeleted) {
                return (
                    <Button variant="outline" size="sm" onClick={() => onRestore(row)}>
                        <RotateCcw />
                        Restore
                    </Button>
                );
            }
            return (
                <TDPopover
                    trigger={
                        <Button variant="ghost" size="icon" aria-label={`Actions for ${row.name}`}>
                            <EllipsisVertical />
                        </Button>
                    }
                    className="max-w-[180px]"
                >
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            // No credentials row means no role to change.
                            disabled={!row.role}
                            onClick={() => onChangeRole(row)}
                        >
                            <UserCog />
                            Change role
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDisable(row)}>
                            <Ban />
                            Disable
                        </Button>
                    </div>
                </TDPopover>
            );
        },
    },
];
