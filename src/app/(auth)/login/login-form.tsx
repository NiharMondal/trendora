"use client";
import TDInput from "@/components/form/TDInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loginSchema, TLoginSchemaType } from "@/form-schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import React from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = (data: TLoginSchemaType) => {
        console.log(data);
    };
    return (
        <div className="border border-muted rounded-md  p-10">
            <Form {...form}>
                <form
                    className="space-y-5"
                    onSubmit={form.handleSubmit(handleLogin)}
                >
                    <TDInput
                        form={form}
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                    />
                    <TDInput
                        form={form}
                        type="password"
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
                    />
                    <div>
                        <Link
                            href={"/forgot-password"}
                            className="text-accent hover:underline font-normal text-sm"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <Button type="submit" className="w-full cursor-pointer">
                        Sign In
                    </Button>
                </form>
            </Form>
            <div className="mt-10">
                <p className="text-center">
                    Don't have an account?{" "}
                    <Link
                        href={"/register"}
                        className="font-semibold text-accent hover:underline "
                    >
                        Sign Up
                    </Link>{" "}
                </p>
            </div>
        </div>
    );
}
