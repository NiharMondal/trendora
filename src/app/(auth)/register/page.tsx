import Container from "@/components/common/container";
import { socialIcon } from "@/helping-data/image";
import Image from "next/image";
import React from "react";
import LoginForm from "../login/login-form";
import RegisterForm from "./register-form";
import { AUTH_NAV_HEIGHT } from "@/layout";

export default function RegisterPage() {
    return (
        <div
            className={`min-h-[calc(100vh-${AUTH_NAV_HEIGHT})] flex flex-col items-center py-20 space-y-5`}
        >
            <div className="w-full max-w-xl space-y-5">
                <div className="space-y-2">
                    <h1>Register here</h1>
                    <p>Hi, Create a new account </p>
                </div>
                <div className="border border-muted rounded-md flex items-center justify-center p-4">
                    Register with Google Coming Soon
                </div>

                <div className="flex items-center justify-center gap-x-4 text-sm text-muted-foreground w-full">
                    <hr className="border w-full border-muted" />
                    <span className="text-nowrap">or Register with Email</span>
                    <hr className="border w-full border-muted" />
                </div>

                <RegisterForm />
            </div>
        </div>
    );
}
