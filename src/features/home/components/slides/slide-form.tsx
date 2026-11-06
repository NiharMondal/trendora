"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import TDButton from "@/shared/components/td-button";
import TDCheckbox from "@/shared/form/TDCheckbox";
import TDImageUploadField from "@/shared/form/TDImageUpload";
import TDInput from "@/shared/form/TDInput";
import { Form } from "@/shared/ui/form";
import {
    slideFormSchema,
    TSlideFormValues,
} from "@/features/home/schemas/slide-form.schema";

const EMPTY_SLIDE: TSlideFormValues = {
    title: "",
    subtitle: "",
    photo: { url: "", publicId: "" },
    url: "/products",
    sortOrder: 0,
    isActive: true,
};

type Props = {
    defaultValues?: TSlideFormValues;
    /** Resolve `true` on a successful save; the form resets only then. */
    onSubmit: (values: TSlideFormValues) => Promise<boolean>;
    isSubmitting?: boolean;
};

export default function SlideForm({
    defaultValues,
    onSubmit,
    isSubmitting,
}: Props) {
    const isEdit = !!defaultValues;
    const hookForm = useForm<TSlideFormValues>({
        resolver: zodResolver(slideFormSchema),
        defaultValues: defaultValues ?? EMPTY_SLIDE,
    });

    const handleSubmit = async (values: TSlideFormValues) => {
        const saved = await onSubmit(values);
        // A failed save keeps what the admin typed.
        if (saved && !isEdit) hookForm.reset(EMPTY_SLIDE);
    };

    return (
        <Form {...hookForm}>
            <form
                onSubmit={hookForm.handleSubmit(handleSubmit)}
                className="space-y-4 rounded-md bg-white p-5"
            >
                <TDInput
                    form={hookForm}
                    name="title"
                    label="Title"
                    placeholder="New season denim"
                    required
                />
                <TDInput
                    form={hookForm}
                    name="subtitle"
                    label="Subtitle"
                    placeholder="Levi's 501 and more, now up to 25% off"
                    required
                />
                <TDInput
                    form={hookForm}
                    name="url"
                    label="Button link"
                    description="A storefront path such as /products?onSale=true or /categories/jeans, or a full URL."
                    required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    <TDInput
                        form={hookForm}
                        name="sortOrder"
                        label="Sort order"
                        type="number"
                        description="Lower numbers show first."
                        required
                    />
                    <div className="sm:pt-8">
                        <TDCheckbox
                            form={hookForm}
                            name="isActive"
                            label="Show on the storefront"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Slide image <span className="text-destructive">*</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Shown full-width in the hero — use a wide landscape
                        image (2MB max).
                    </p>
                    <TDImageUploadField
                        form={hookForm}
                        urlName="photo.url"
                        publicIdName="photo.publicId"
                        folderName="temp/slides"
                    />
                    {hookForm.formState.errors.photo?.url ? (
                        <p className="text-sm text-destructive">
                            {hookForm.formState.errors.photo.url.message}
                        </p>
                    ) : null}
                </div>
                <TDButton type="submit" isLoading={isSubmitting}>
                    {isEdit ? "Update slide" : "Create slide"}
                </TDButton>
            </form>
        </Form>
    );
}
