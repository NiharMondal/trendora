"use client";
import { useForm } from "react-hook-form";

import TDImageUploadField from "@/components/form-input/TDImageUpload";
import TDInput from "@/components/form-input/TDInput";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import TDButton from "../shared/td-button";
import {
    profileFormSchema,
    TProfileFormValues,
} from "./profile-form-validation";
import { useUpdateMyProfileMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
type TProfileFormProps = {
    defaultValues: TProfileFormValues | undefined;
    isSubmitting?: boolean;
};
export default function ProfileForm({ defaultValues }: TProfileFormProps) {
    const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();
    const form = useForm<TProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        values: defaultValues ?? {
            name: "",
            phone: "",
            avatar: {
                url: "",
                publicId: "",
            },
        },
    });

    const handleUpdateAccount = async (values: TProfileFormValues) => {
        try {
            const res = await updateProfile({ payload: values }).unwrap();
            if (res?.success) {
                toast.success(res?.message);
            }
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleUpdateAccount)}
                className="space-y-1 bg-white p-10 rounded-2xl shadow col-span-full lg:col-span-2"
            >
                <div className="max-w-[200px] mb-3">
                    <TDImageUploadField
                        form={form}
                        folderName="temp/avatar"
                        urlName={`avatar.url`}
                        publicIdName={`avatar.publicId`}
                    />
                </div>
                <TDInput
                    inputSize="sm"
                    form={form}
                    name="name"
                    label="Full Name"
                />
                <TDInput
                    inputSize="sm"
                    form={form}
                    name="phone"
                    label="Contact Number"
                />
                <TDButton type="submit" isLoading={isLoading}>
                    Update Information
                </TDButton>
            </form>
        </Form>
    );
}
