import { AUTH_NAV_HEIGHT } from "@/features/auth/constants/auth-nav";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/features/auth/lib/auth-options";
import { roleHomePath } from "@/features/auth/utils/role-home";

import GoogleLoginButton from "@/features/auth/components/google-login-button";
import LoginForm from "@/features/auth/components/login-form";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session?.user && !session.error) {
        redirect(roleHomePath(session.user.role));
    }

    return (
        <div
            className={`min-h-[calc(100vh-${AUTH_NAV_HEIGHT})] flex flex-col items-center py-20 space-y-5`}
        >
            <div className="w-full max-w-xl space-y-5">
                <div className="space-y-2">
                    <h1>Login</h1>
                    <p>Hi, Welcome back </p>
                </div>
                <GoogleLoginButton />

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
