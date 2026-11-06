"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import TDButton from "@/shared/components/td-button";
import TDInput from "@/shared/form/TDInput";
import { Form } from "@/shared/ui/form";

import { useResetPasswordMutation } from "@/features/auth/api/auth.api";
import {
    resetPasswordSchema,
    TResetPasswordValues,
} from "@/features/auth/schemas/reset-password.schema";

const INVALID_LINK_MESSAGE =
    "This password reset link is invalid or has expired. Please request a new one.";

export default function ResetPasswordForm({ token }: { token?: string }) {
    const router = useRouter();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    // Unknown, expired, used and malformed tokens all come back as the same
    // 400; surface it as-is and offer a fresh link.
    const [linkError, setLinkError] = useState<string | null>(
        token ? null : INVALID_LINK_MESSAGE
    );

    const form = useForm<TResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: TResetPasswordValues) => {
        if (!token) return;
        try {
            const res = await resetPassword({
                token,
                newPassword: data.newPassword,
            }).unwrap();
            toast.success(res.message);
            // No tokens come back from this endpoint by design — the user
            // signs in with the new password.
            router.replace("/login");
        } catch (error) {
            const err = error as { status?: number; data?: { message?: string } };
            const message = err?.data?.message || "Something went wrong! Please try again.";
            if (err?.status === 400) {
                setLinkError(message);
            } else {
                toast.error(message);
            }
        }
    };

    if (linkError) {
        return (
            <div className="border border-muted rounded-md min-w-lg max-w-xl p-10 space-y-4 text-center">
                <p className="text-destructive">{linkError}</p>
                <Link
                    href={"/forgot-password"}
                    className="text-sm text-muted-foreground block hover:text-accent underline"
                >
                    Request a new reset link
                </Link>
            </div>
        );
    }

    return (
        <div className="border border-muted rounded-md min-w-lg max-w-xl p-10">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    <TDInput
                        name="newPassword"
                        label="New Password"
                        type="password"
                        form={form}
                        required
                    />
                    <TDInput
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        form={form}
                        required
                    />
                    <TDButton
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Reset Password
                    </TDButton>
                </form>
                <Link
                    href={"/login"}
                    className="text-center text-sm text-muted-foreground mt-5 block hover:text-accent underline"
                >
                    Back to Login
                </Link>
            </Form>
        </div>
    );
}
