"use client";
import TDButton from "@/components/common/shared/td-button";
import TDInput from "@/components/form-input/TDInput";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { registerSchema, TRegisterValues } from "./register-schema";

export default function RegisterForm() {
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const handleRegistration = (data: TRegisterValues) => {
        console.log(data);
    };
    return (
        <div className="border border-muted rounded-md  p-10">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleRegistration)}
                    className="space-y-5"
                >
                    <TDInput
                        form={form}
                        label="Fullname"
                        name="name"
                        placeholder="Enter your fullname"
                    />
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
                    <TDButton type="submit" className="w-full">
                        Create Account
                    </TDButton>
                </form>
            </Form>
            <div className="mt-10">
                <p className="text-center">
                    Already have an account?{" "}
                    <Link
                        href={"/login"}
                        className="font-semibold text-accent hover:underline "
                    >
                        Sign In
                    </Link>{" "}
                </p>
            </div>
        </div>
    );
}
