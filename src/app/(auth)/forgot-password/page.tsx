import React from "react";
import ForgotPasswordForm from "./forgot-password-form";

export default function ForgotPasswordPage() {
    return (
        <div className="flex flex-col items-center justify-center pt-10 md:pt-20">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="text-muted-foreground mb-5">
                Enter your email address to reset your password
            </p>
            <ForgotPasswordForm />
        </div>
    );
}
