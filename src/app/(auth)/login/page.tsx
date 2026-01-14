import React from "react";
import { AUTH_NAV_HEIGHT } from "@/layout";
import LoginForm from "./login-form";

export default function LoginPage() {
    return (
        <div
            className={`min-h-[calc(100vh-${AUTH_NAV_HEIGHT})] flex flex-col items-center py-20 space-y-5`}
        >
            <div className="w-full max-w-xl space-y-5">
                <div className="space-y-2">
                    <h1>Login</h1>
                    <p>Hi, Welcome back </p>
                </div>
                <div className="border border-muted rounded-md flex items-center justify-center p-4">
                    Login with Google Coming Soon
                </div>

                <div className="flex items-center justify-center gap-x-4 text-sm text-muted-foreground w-full">
                    <hr className="border w-full border-muted" />
                    <span className="text-nowrap">or Login with Email</span>
                    <hr className="border w-full border-muted" />
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
