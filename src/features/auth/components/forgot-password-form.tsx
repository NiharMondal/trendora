"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import TDButton from "@/shared/components/td-button";
import TDInput from "@/shared/form/TDInput";
import { Form } from "@/shared/ui/form";

import { useForgotPasswordMutation } from "@/features/auth/api/auth.api";
import {
    forgotPasswordSchema,
    TForgotPasswordValues,
} from "@/features/auth/schemas/forgot-password.schema";

export default function ForgotPasswordForm() {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    // The backend answers every input with the same generic message, so this
    // holds that message verbatim — never a claim about whether the account exists.
    const [sentMessage, setSentMessage] = useState<string | null>(null);

    const form = useForm<TForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: TForgotPasswordValues) => {
        try {
            const res = await forgotPassword(data).unwrap();
            setSentMessage(res.message);
        } catch (error) {
            toast.error(
                (error as { data?: { message?: string } })?.data?.message ||
                    "Something went wrong! Please try again."
            );
        }
    };

    if (sentMessage) {
        return (
            <div className="border border-muted rounded-md min-w-lg max-w-xl p-10 space-y-4 text-center">
                <MailCheck className="mx-auto size-10 text-primary" />
                <h2 className="text-xl font-semibold">Check your inbox</h2>
                <p className="text-muted-foreground">{sentMessage}</p>
                <p className="text-sm text-muted-foreground">
                    The link expires shortly and can be used once. Signed up
                    with Google? Your account has no password to reset — use
                    the Google button on the login page instead.
                </p>
                <button
                    type="button"
                    onClick={() => setSentMessage(null)}
                    className="text-sm text-muted-foreground hover:text-accent underline"
                >
                    Didn&apos;t get it? Send again
                </button>
                <Link
                    href={"/login"}
                    className="text-sm text-muted-foreground block hover:text-accent underline"
                >
                    Back to Login
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
                        name="email"
                        label="Email"
                        type="email"
                        form={form}
                        required
                    />
                    <TDButton
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Send Reset Link
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
