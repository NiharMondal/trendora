"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import TDButton from "@/components/common/shared/td-button";
import TDInput from "@/components/form-input/TDInput";
import { Form } from "@/components/ui/form";

import {
    forgotPasswordSchema,
    TForgotPasswordValues,
} from "./forgot-password-schema";

export default function ForgotPasswordForm() {
    const form = useForm<TForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (data: TForgotPasswordValues) => {
        console.log(data);
    };
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
                    <TDButton type="submit" className="w-full">
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
