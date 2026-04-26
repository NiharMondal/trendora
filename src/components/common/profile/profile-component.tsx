"use client";
import { useMyProfileQuery } from "@/redux/api/userApi";
import ProfileForm from "./profile-form";
import { TProfileFormValues } from "./profile-form-validation";

export default function ProfileComponent() {
    const { data } = useMyProfileQuery(undefined);

    const defaultValues = {
        name: data?.result?.name ?? "",
        phone: data?.result?.phone ?? "",
        avatar:
            data?.result?.avatar
                ? {
                      url: data?.result?.avatar,
                      publicId: data?.result?.avatarPublicId || "",
                  }
                : {},
    };

    return (
        <div className="space-y-5">
            <div className="space-y-0.5">
                <h4>Your Account Information</h4>
                <p className="text-sm text-gray-500 font-normal">
                    You can update your account Information anytime
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-8">
                <ProfileForm
                    defaultValues={defaultValues as TProfileFormValues}
                />
            </div>
        </div>
    );
}
