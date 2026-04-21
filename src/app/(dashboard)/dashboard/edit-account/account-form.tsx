"use client";
import { useForm } from "react-hook-form";

import TDImageUploadField from "@/components/form-input/TDImageUpload";
import TDInput from "@/components/form-input/TDInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountFormSchema, TAccountFormValues } from "./account-form-schema";


export default function AccountForm() {
    const form = useForm<TAccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: "",
            phone: "",
            avatar: {
                url: "",
                publicId: "",
            },
        },
    });

    const handleUpdateAccount = (values: TAccountFormValues) => {
        console.log(values);
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateAccount)} className="space-y-5 bg-white p-10 rounded-2xl shadow col-span-full lg:col-span-2">
                <div className="max-w-[200px]">
                    <TDImageUploadField
                        form={form}
                        folderName="trendora/temp/avatar"
                        urlName={`avatar.url`}
                        publicIdName={`avatar.publicId`}
                    />
                </div>
                <TDInput form={form} name="name" label="Full Name" />
                <TDInput form={form} name="phone" label="Contact Number" />
                <Button size={"lg"} type="submit">
                    Update Information
                </Button>
            </form>
        </Form>
    );
}
