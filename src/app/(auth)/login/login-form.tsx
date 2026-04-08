"use client";
import TDInput from "@/components/form-input/TDInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useAppDispatch } from "@/redux/redux.hooks";
import {
    setCredentials,
    TLoginSessionResponse,
    TUserState,
} from "@/redux/slice/authSlice";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, TLoginValues } from "./login-schema";
import { useRouter } from "next/navigation";
import { EnumUserRole } from "@/global/user-role";
import { setCookie } from "cookies-next";
import { getSession, signIn } from "next-auth/react";

export default function LoginForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();

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

            if (res?.ok) {
                // Fetch session to retrieve user role and token so we can sync Redux
                const session = await getSession();

                if (session && session.user) {
                    // Sync token to cookie and Redux to keep existing RTK queries working smoothly
                    const userRole = (session.user as TUserState).role;
                    const token = (session as TLoginSessionResponse)
                        .accessToken;

                    setCookie("accessToken", token);
                    dispatch(
                        setCredentials({
                            user: session.user as TUserState,
                            token: token,
                        }),
                    );

                    if (userRole === EnumUserRole.ADMIN) {
                        router.push("/admin");
                    } else {
                        router.push("/dashboard");
                    }
                    router.refresh();
                }
                toast.success("Logged in successfully");
            }
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
        }
    };
    return (
        <div className="border border-muted rounded-md  p-10">
            <Form {...form}>
                <form
                    className="space-y-5"
                    onSubmit={form.handleSubmit(handleLogin)}
                    autoComplete="off"
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
