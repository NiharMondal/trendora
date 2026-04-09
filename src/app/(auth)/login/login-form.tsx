"use client";
import TDInput from "@/components/form-input/TDInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, TLoginValues } from "./login-schema";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { EnumUserRole } from "@/global/user-role";

export default function LoginForm() {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (data: TLoginValues) => {
        try {
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
            const role = (session as any)?.user?.role;
            if (role === EnumUserRole.ADMIN) router.push("/admin");
            else router.push("/dashboard");
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
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
                        type="password"
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
            <div className="mt-10 text-center">
                Don't have an account?{" "}
                <Link
                    href={"/register"}
                    className="font-semibold text-accent hover:underline"
                >
                    Sign Up
                </Link>
            </div>
        </div>
    );
}
