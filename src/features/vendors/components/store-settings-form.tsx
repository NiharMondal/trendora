"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { vendorStatusMap } from "@/features/orders/constants/status-maps";
import {
    useMyStoreQuery,
    useUpdateMyStoreMutation,
} from "@/features/vendors/api/vendor.api";
import { storeSettingsSchema } from "@/features/vendors/schemas/vendor-form.schema";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import NoDataFound from "@/shared/components/no-data-found";
import TDButton from "@/shared/components/td-button";
import TDImageUploadField from "@/shared/form/TDImageUpload";
import TDInput from "@/shared/form/TDInput";
import TDTextArea from "@/shared/form/TDTextArea";
import { Form } from "@/shared/ui/form";
import { StatusBadge } from "@/shared/ui/status-badge";

/**
 * Store settings.
 *
 * Includes the store's delivery pricing, which is what checkout actually
 * charges for this store's items — so it is worth being explicit that changing
 * it changes what buyers pay.
 *
 * Commission is NOT here: it is the platform's term, set by an admin. Sending
 * it would be ignored by the backend.
 */
export default function StoreSettingsForm() {
    const { data, isLoading } = useMyStoreQuery();
    const [updateStore, { isLoading: isSaving }] = useUpdateMyStoreMutation();

    const store = data?.result;

    const form = useForm({
        resolver: zodResolver(storeSettingsSchema),
        values: store
            ? {
                  storeName: store.storeName,
                  description: store.description ?? "",
                  businessEmail: store.businessEmail,
                  businessPhone: store.businessPhone,
                  taxId: store.taxId ?? "",
                  shippingFee: Number(store.shippingFee),
                  freeShippingThreshold: Number(store.freeShippingThreshold),
                  logo: {
                      url: store.logo ?? "",
                      publicId: store.logoPublicId ?? "",
                  },
                  banner: {
                      url: store.banner ?? "",
                      publicId: store.bannerPublicId ?? "",
                  },
              }
            : undefined,
    });

    if (isLoading) return <SpinnerLoading />;

    if (!store) {
        return (
            <NoDataFound
                title="No store yet"
                description="Apply to sell on Trendora to get store settings."
            />
        );
    }

    const handleSubmit = async (
        values: Parameters<typeof updateStore>[0],
    ) => {
        // Only send images that actually have a URL — the backend's schema
        // rejects `{ url: "" }`.
        const payload = {
            ...values,
            logo: values.logo?.url ? values.logo : undefined,
            banner: values.banner?.url ? values.banner : undefined,
        };

        try {
            await updateStore(payload).unwrap();
            toast.success("Store updated");
        } catch (error: unknown) {
            const message = (error as { data?: { message?: string } })?.data
                ?.message;
            toast.error(message ?? "Could not update your store");
        }
    };

    return (
        <Form {...form}>
            <form
                className="space-y-5"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <div className="bg-white rounded-md p-5 flex items-center justify-between">
                    <div>
                        <h5 className="text-lg font-semibold">
                            {store.storeName}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                            /stores/{store.slug}
                        </p>
                    </div>
                    <StatusBadge
                        statusMap={vendorStatusMap}
                        status={store.status}
                    />
                </div>

                <div className="bg-white rounded-md p-5 space-y-5">
                    <h5 className="text-lg font-semibold">Storefront</h5>

                    <TDInput
                        form={form}
                        name="storeName"
                        label="Store name"
                        required
                    />
                    <p className="text-xs text-muted-foreground -mt-3">
                        Renaming your store changes its public URL.
                    </p>

                    <TDTextArea
                        form={form}
                        name="description"
                        label="About your store"
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
                        <h5 className="text-lg font-semibold">Delivery</h5>
                        <p className="text-sm text-muted-foreground">
                            These are charged on your items only. A buyer
                            ordering from two stores pays each store&apos;s
                            delivery separately.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1.5">
                        <TDInput
                            form={form}
                            name="shippingFee"
                            label="Delivery fee"
                            type="number"
                            required
                        />
                        <TDInput
                            form={form}
                            name="freeShippingThreshold"
                            label="Free delivery over"
                            type="number"
                            required
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Currently: {currencyFormatter(Number(store.shippingFee))}{" "}
                        delivery, free over{" "}
                        {currencyFormatter(Number(store.freeShippingThreshold))}.
                    </p>
                </div>

                <div className="bg-white rounded-md p-5 space-y-5">
                    <div>
                        <h5 className="text-lg font-semibold">
                            Business details
                        </h5>
                        <p className="text-sm text-muted-foreground">
                            Not shown to shoppers.
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
                        <TDInput form={form} name="taxId" label="Tax ID" />
                    </div>

                    {/* Commission is an admin-set term, shown read-only so the
                        seller can see it without being able to change it. */}
                    <div className="rounded-md border border-muted p-4 text-sm">
                        <p className="font-medium">
                            Commission: {(Number(store.commissionRate) * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Set by Trendora on your merchandise subtotal. Contact
                            support to discuss it.
                        </p>
                    </div>

                    <TDButton type="submit" isLoading={isSaving}>
                        Save changes
                    </TDButton>
                </div>
            </form>
        </Form>
    );
}
