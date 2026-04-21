"use client"
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import ChangePasswordForm from "./change-password-form";
import { TChangePasswordValues } from "./change-password-schema";

export default function ChangePasswordComponent() {
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleChangePassword = async (values: TChangePasswordValues) => {
        try {
            await changePassword(values).unwrap();
            toast.success("Password changed successfully");
        } catch (error: any) {
            toast.error(error.data.message || "Failed to change password");
        }
    };

    return (
        <ChangePasswordForm
            onSubmit={handleChangePassword}
            isLoading={isLoading}
        />
    );
}
