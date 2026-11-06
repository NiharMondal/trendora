"use client"
import { useChangePasswordMutation } from "@/features/auth/api/auth.api";
import { toast } from "sonner";
import ChangePasswordForm from "./change-password-form";
import { TChangePasswordValues } from "@/features/users/schemas/change-password.schema";
import { getApiErrorMessage } from "@/shared/utils/api-error";

export default function ChangePasswordComponent() {
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleChangePassword = async (values: TChangePasswordValues) => {
        try {
            await changePassword(values).unwrap();
            toast.success("Password changed successfully");
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Failed to change password"));
        }
    };

    return (
        <ChangePasswordForm
            onSubmit={handleChangePassword}
            isLoading={isLoading}
        />
    );
}
