"use client";
import TDInput from "@/components/form-input/TDInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
    changePasswordSchema,
    TChangePassword,
} from "@/form-schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function PasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<TChangePassword>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const handleChangePassword = async (values: TChangePassword) => {
        console.log(values);
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleChangePassword)}
                className="space-y-5 bg-white p-10 rounded-2xl shadow"
            >
                <TDInput
                    form={form}
                    name="oldPassword"
                    label="Old Password"
                    type="password"
                />
                <TDInput
                    form={form}
                    name="newPassword"
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    ornament={
                        <button
                            type="button"
                            className="mt-1.5 cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    }
                />
                <TDInput
                    form={form}
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                />
                <Button size={"lg"} type="submit">
                    Change Password
                </Button>
            </form>
        </Form>
    );
}
