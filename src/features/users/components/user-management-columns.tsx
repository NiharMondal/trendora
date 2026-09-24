import { DataTableColumn } from "@/shared/components/table/table-types";
import TdAvatar from "@/shared/components/td-avatar";
import { formatDate } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import { TUser } from "@/features/users/types/user.types";

const ROLE_STYLES: Record<string, string> = {
    ADMIN: "bg-primary-100 text-primary-700",
    VENDOR: "bg-warning-100 text-warning-700",
    CUSTOMER: "bg-muted text-foreground/80",
};

// Read-only for now. The backend's admin actions (disable/restore via
// `DELETE /users/:id` + `PATCH /users/:id/restore`, `PATCH /users/:id/role`)
// are FE-16; the Edit/Delete buttons that used to sit here had no handlers.
export const userManagementColumns: DataTableColumn<TUser>[] = [
    {
        header: "User",
        key: "user",
        cell: (row) => (
            <div className="flex items-center gap-x-3">
                <TdAvatar
                    src={row.avatar || undefined}
                    alt={row.name}
                    fallback={row.name?.charAt(0).toUpperCase() || "U"}
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
        cell: (row) => formatDate(row.createdAt),
    },
];
