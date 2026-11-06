import ResetPasswordForm from "@/features/auth/components/reset-password-form";

// The emailed link is `${FRONTEND_URL}/reset-password?token=<raw>` — this path
// and param name are the backend contract (XR-11).
export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const { token } = await searchParams;

    return (
        <div className="flex flex-col items-center justify-center pt-10 md:pt-20">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground mb-5">
                Choose a new password for your account
            </p>
            <ResetPasswordForm token={token} />
        </div>
    );
}
