"use client";
import TDInput from "@/components/form-input/TDInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { loginSchema, TLoginValues } from "./login-schema";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { toast } from "sonner";

export default function LoginForm() {
    const [loginUser] = useLoginUserMutation()
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async(data: TLoginValues) => {
        try{
            const res = await loginUser(data).unwrap();
            console.log(res)
            if(res?.success){
                toast.success(res?.message);
                form.reset();
            }
        }catch(error){
            toast.error("Something went wrong");
        }
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
