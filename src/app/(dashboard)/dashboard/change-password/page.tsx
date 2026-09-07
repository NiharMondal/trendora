import ChangePasswordComponent from "@/features/users/components/change-password/change-password-component";
import Headline from "@/shared/components/headline";

export default function ChangePasswordPage() {
    return (
        <div className="space-y-4">
            <Headline title="Change your password" showBackButton />
            <ChangePasswordComponent />
        </div>
    );
}
