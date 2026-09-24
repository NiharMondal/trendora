"use client";
import { useMyProfileQuery } from "@/features/users/api/user.api";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import QueryError from "@/shared/components/query-error";
import ProfileForm from "./profile-form";
import { TProfileFormValues } from "@/features/users/schemas/profile-form.schema";

export default function ProfileComponent() {
    const { data, isLoading, error, refetch } = useMyProfileQuery(undefined);

    if (isLoading) return <SpinnerLoading />;
    // A failed load must not render the form: its blank defaults would save
    // over the real name and phone.
    if (error) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load your profile"
            />
        );
    }

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
