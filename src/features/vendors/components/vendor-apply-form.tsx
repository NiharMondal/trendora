"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useApplyForVendorMutation } from "@/features/vendors/api/vendor.api";
import { vendorApplySchema } from "@/features/vendors/schemas/vendor-form.schema";
import TDButton from "@/shared/components/td-button";
import TDImageUploadField from "@/shared/form/TDImageUpload";
import TDInput from "@/shared/form/TDInput";
import TDTextArea from "@/shared/form/TDTextArea";
import { Form } from "@/shared/ui/form";

/**
 * The seller application.
 *
 * There is no commission or approval field here on purpose — both are the
 * platform's decision, and the backend ignores them if sent. The store is
 * created PENDING and cannot list anything until an admin approves it, which
 * is also when the account's role becomes VENDOR.
 */
export default function VendorApplyForm() {
    const router = useRouter();
    const [applyForVendor, { isLoading }] = useApplyForVendorMutation();

    const form = useForm({
        resolver: zodResolver(vendorApplySchema),
        defaultValues: {
            storeName: "",
            description: "",
            businessEmail: "",
            businessPhone: "",
            taxId: "",
            logo: { url: "", publicId: "" },
            banner: { url: "", publicId: "" },
        },
    });

    const handleSubmit = async (
        values: Parameters<typeof applyForVendor>[0],
    ) => {
        // TDImageUpload always writes both fields; an untouched upload leaves
        // them empty, and an empty image must not be sent as `{url: ""}`
        // because the schema requires a real URL.
        const payload = {
            ...values,
            logo: values.logo?.url ? values.logo : undefined,
            banner: values.banner?.url ? values.banner : undefined,
        };

        try {
            await applyForVendor(payload).unwrap();
            toast.success(
                "Application submitted. We'll review your store shortly.",
            );
            router.push("/vendor");
        } catch (error: unknown) {
            const message = (error as { data?: { message?: string } })?.data
                ?.message;
            toast.error(message ?? "Could not submit your application");
        }
    };

    return (
        <Form {...form}>
            <form
                className="space-y-5"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <div className="bg-white rounded-md p-5 space-y-5">
                    <div>
                        <h5 className="text-lg font-semibold">
                            Your store
                        </h5>
                        <p className="text-sm text-muted-foreground">
                            This is what shoppers see. You can change it later.
                        </p>
                    </div>

                    <TDInput
                        form={form}
                        name="storeName"
                        label="Store name"
                        placeholder="Urban Threads"
                        required
                    />

                    <TDTextArea
                        form={form}
                        name="description"
                        label="About your store"
                        placeholder="What you sell, how long you've been doing it, how you ship…"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Store logo
                            </p>
                            <TDImageUploadField
                                form={form}
                                urlName="logo.url"
                                publicIdName="logo.publicId"
                                folderName="vendors"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Store banner
                            </p>
                            <TDImageUploadField
                                form={form}
                                urlName="banner.url"
                                publicIdName="banner.publicId"
                                folderName="vendors"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-md p-5 space-y-5">
                    <div>
                        <h5 className="text-lg font-semibold">
                            Business details
                        </h5>
                        <p className="text-sm text-muted-foreground">
                            How we reach you about orders and payouts. Not shown
                            to shoppers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1.5">
                        <TDInput
                            form={form}
                            name="businessEmail"
                            label="Business email"
                            type="email"
                            required
                        />
                        <TDInput
                            form={form}
                            name="businessPhone"
                            label="Business phone"
                            required
                        />
                        <TDInput
                            form={form}
                            name="taxId"
                            label="Tax ID (optional)"
                        />
                    </div>

                    <TDButton type="submit" isLoading={isLoading}>
                        Submit application
                    </TDButton>
                </div>
            </form>
        </Form>
    );
}
