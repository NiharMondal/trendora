"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import TDInput from "@/components/form-input/TDInput";
import { Form } from "@/components/ui/form";

import TDButton from "@/components/common/shared/td-button";
import {
    changePasswordSchema,
    TChangePasswordValues,
} from "./change-password-schema";

export default function ChangePasswordForm() {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const form = useForm<TChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const handleChangePassword = async (values: TChangePasswordValues) => {
        console.log(values);
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleChangePassword)}
                className="space-y-1 bg-white p-10 rounded-2xl shadow"
            >
                <TDInput
                    form={form}
                    name="oldPassword"
                    label="Old Password"
                    type={showOldPassword ? "text" : "password"}
                    inputSize="sm"
                    ornament={
                        <button
                            type="button"
                            className="mt-1.5 cursor-pointer"
                            onClick={() => setShowOldPassword((prev) => !prev)}
                        >
                            {showOldPassword ? (
                                <EyeOff className="text-gray-500" />
                            ) : (
                                <Eye className="text-gray-500" />
                            )}
                        </button>
                    }
                />
                <TDInput
                    form={form}
                    name="newPassword"
                    label="New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    inputSize="sm"
                    ornament={
                        <button
                            type="button"
                            className="mt-1.5 cursor-pointer"
                            onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="text-gray-500" />
                            ) : (
                                <Eye className="text-gray-500" />
                            )}
                        </button>
                    }
                />
                <TDInput
                    form={form}
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    inputSize="sm"
                    ornament={
                        <button
                            type="button"
                            className="mt-1.5 cursor-pointer"
                            onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="text-gray-500" />
                            ) : (
                                <Eye className="text-gray-500" />
                            )}
                        </button>
                    }
                />
                <TDButton type="submit">Change Password</TDButton>
            </form>
        </Form>
    );
}
