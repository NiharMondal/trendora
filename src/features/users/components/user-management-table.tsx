"use client";

import { UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
    useAllUserQuery,
    useDisableUserMutation,
    useRestoreUserMutation,
    useUpdateUserRoleMutation,
} from "@/features/users/api/user.api";
import { useUserInfoClient } from "@/features/auth/utils/user-info";
import { TAssignableRole, TUser } from "@/features/users/types/user.types";
import { DataTable } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import { userSortOptions } from "@/shared/constants/sort-options";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { Button } from "@/shared/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { userManagementColumns } from "./user-management-columns";

const ASSIGNABLE_ROLES: { value: TAssignableRole; label: string }[] = [
    { value: "CUSTOMER", label: "Customer" },
    { value: "ADMIN", label: "Admin" },
];

export default function UserManagementTable() {
    const currentUser = useUserInfoClient();
    const filters = useTableFilters({
        defaultSortBy: "createdAt:desc",
        // "" is the backend default — active accounts only. `true` lists the
        // disabled ones, which is the only way to reach Restore.
        defaultFilters: { isDeleted: "" },
    });

    const {
        data: users,
        isFetching,
        error: listError,
        refetch: refetchList,
    } = useAllUserQuery(filters.queryParams as Record<string, string>);

    const [disableUser, { isLoading: isDisabling }] = useDisableUserMutation();
    const [restoreUser, { isLoading: isRestoring }] = useRestoreUserMutation();
    const [updateRole, { isLoading: isUpdatingRole }] =
        useUpdateUserRoleMutation();

    const [disableTarget, setDisableTarget] = useState<TUser | null>(null);
    const [restoreTarget, setRestoreTarget] = useState<TUser | null>(null);
    const [roleTarget, setRoleTarget] = useState<TUser | null>(null);
    const [nextRole, setNextRole] = useState<TAssignableRole | "">("");

    // The backend's refusals are specific and actionable ("Suspend the store
    // first", "You cannot disable your own account") — show them verbatim.
    const run = async (action: () => Promise<unknown>, success: string) => {
        try {
            await action();
            toast.success(success);
            return true;
        } catch (error) {
            toast.error(getApiErrorMessage(error));
            return false;
        }
    };

    const confirmDisable = async () => {
        if (!disableTarget) return;
        const ok = await run(
            () => disableUser(disableTarget.id).unwrap(),
            `${disableTarget.name}'s account is disabled`,
        );
        if (ok) setDisableTarget(null);
    };

    const confirmRestore = async () => {
        if (!restoreTarget) return;
        const ok = await run(
            () => restoreUser(restoreTarget.id).unwrap(),
            `${restoreTarget.name}'s account is active again`,
        );
        if (ok) setRestoreTarget(null);
    };

    const confirmRole = async () => {
        if (!roleTarget || !nextRole) return;
        const ok = await run(
            () => updateRole({ id: roleTarget.id, role: nextRole }).unwrap(),
            `${roleTarget.name} is now ${nextRole === "ADMIN" ? "an admin" : "a customer"}`,
        );
        if (ok) setRoleTarget(null);
    };

    const showingDisabled = filters.columnFilters?.isDeleted === "true";

    return (
        <>
            <DataTable
                title="User management"
                description={
                    showingDisabled
                        ? "Disabled accounts. They cannot sign in; restoring one does not reopen their store."
                        : "Every active account on Trendora — shoppers, sellers and admins."
                }
                icon={Users}
                columns={userManagementColumns({
                    currentUserId: currentUser?.id,
                    onDisable: setDisableTarget,
                    onRestore: setRestoreTarget,
                    onChangeRole: (user) => {
                        setNextRole("");
                        setRoleTarget(user);
                    },
                })}
                data={users?.result || []}
                rowKey={(row) => row.id}
                error={listError}
                onRetry={refetchList}
                isFetching={isFetching}
                filters={filters}
                meta={users?.meta}
                sortByOptions={userSortOptions}
                toolbarFilters={[
                    {
                        key: "isDeleted",
                        label: "Status",
                        icon: UserCheck,
                        allLabel: "Active accounts",
                        options: [{ label: "Disabled accounts", value: "true" }],
                    },
                ]}
                // The backend searches name, phone and email (case-insensitive).
                placeholder="Search by name, email or phone..."
                emptyState={{
                    title: showingDisabled ? "No disabled accounts" : "No users found",
                }}
            />

            <TDModal
                open={!!disableTarget}
                onOpenChange={(open) => !open && setDisableTarget(null)}
                title={`Disable ${disableTarget?.name ?? "this account"}?`}
                description="They are signed out on their next request and cannot log in. If they sell, their store is suspended and its listings leave the storefront. You can restore the account later, but the store must be reinstated separately."
            >
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDisableTarget(null)}>
                        Cancel
                    </Button>
                    <TDButton
                        variant="destructive"
                        onClick={confirmDisable}
                        isLoading={isDisabling}
                    >
                        Disable account
                    </TDButton>
                </div>
            </TDModal>

            <TDModal
                open={!!restoreTarget}
                onOpenChange={(open) => !open && setRestoreTarget(null)}
                title={`Restore ${restoreTarget?.name ?? "this account"}?`}
                description="They can sign in again. A store suspended when the account was disabled stays suspended until you reinstate it from the vendor list."
            >
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setRestoreTarget(null)}>
                        Cancel
                    </Button>
                    <TDButton onClick={confirmRestore} isLoading={isRestoring}>
                        Restore account
                    </TDButton>
                </div>
            </TDModal>

            <TDModal
                open={!!roleTarget}
                onOpenChange={(open) => !open && setRoleTarget(null)}
                title={`Change ${roleTarget?.name ?? "user"}'s role`}
                description={`Currently ${roleTarget?.role ?? "-"}. Seller access comes from approving their store, not from here.`}
            >
                <div className="mt-4 space-y-4">
                    <Select
                        value={nextRole}
                        onValueChange={(value) => setNextRole(value as TAssignableRole)}
                    >
                        <SelectTrigger className="w-full" aria-label="New role">
                            <SelectValue placeholder="Choose a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {ASSIGNABLE_ROLES.filter(
                                (option) => option.value !== roleTarget?.role,
                            ).map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {nextRole === "ADMIN" ? (
                        <p className="text-sm text-warning-700">
                            Admins can moderate stores, issue refunds and manage every account.
                        </p>
                    ) : null}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setRoleTarget(null)}>
                            Cancel
                        </Button>
                        <TDButton
                            onClick={confirmRole}
                            isLoading={isUpdatingRole}
                            disabled={!nextRole}
                        >
                            Change role
                        </TDButton>
                    </div>
                </div>
            </TDModal>
        </>
    );
}
