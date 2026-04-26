import ChangePasswordComponent from "@/components/@dashboard/customer/change-password/change-password-component";
import Headline from "@/components/common/dashboard/headline";

export default function ChangePasswordPage() {
    return (
        <div className="space-y-4">
            <Headline title="Change your password" showBackButton />
            <ChangePasswordComponent />
        </div>
    );
}
