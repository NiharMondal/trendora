import { AUTH_NAV_HEIGHT } from "@/components/layout/auth/constant";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { EnumUserRole } from "@/global/user-role";

import GoogleLoginButton from "@/components/common/@ui/google-login-button";
import LoginForm from "./login-form";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session?.user) {
        const role = (session.user as any).role;
        if (role === EnumUserRole.ADMIN || role === EnumUserRole.SUPER_ADMIN) {
            redirect("/admin");
        } else {
            redirect("/dashboard");
        }
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
