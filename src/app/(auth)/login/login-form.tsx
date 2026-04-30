"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { EnumUserRole } from "@/global/user-role";

import TDButton from "@/components/common/shared/td-button";
import TDInput from "@/components/form-input/TDInput";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginSchema, TLoginValues } from "./login-schema";

export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (data: TLoginValues) => {
        try {
            setIsLoading(true);
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (res?.error) {
                toast.error(res.error);
                return;
            }

            toast.success("Logged in successfully");
            const session = await getSession();
            const role = session?.user?.role;
            if (
                role === EnumUserRole.ADMIN ||
                role === EnumUserRole.SUPER_ADMIN
            ) {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border border-muted rounded-md p-10">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleLogin)}
                    className="space-y-5"
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
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        ornament={
                            <button
                                type="button"
                                className="mt-1.5 cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? (
                                    <EyeOff className="text-gray-500" />
                                ) : (
                                    <Eye className="text-gray-500" />
                                )}
                            </button>
                        }
                    />
                    <div>
                        <Link
                            href={"/forgot-password"}
                            className="text-accent hover:underline font-normal text-sm"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <TDButton
                        type="submit"
                        isLoading={isLoading}
                        className="w-full cursor-pointer"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </TDButton>
                </form>
            </Form>
            <div className="mt-10 text-center">
                Don&apos;t have an account?
                <Link
                    href={"/register"}
                    className="font-semibold text-accent hover:underline ml-1"
                >
                    Sign Up
                </Link>
            </div>
        </div>
    );
}
