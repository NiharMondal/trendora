"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import TDCombobox from "@/shared/form/TDCombobox";
import TDImageUploadField from "@/shared/form/TDImageUpload";
import TDInput from "@/shared/form/TDInput";
import { Form } from "@/shared/ui/form";
import { useAllSizeGroupsQuery } from "@/features/size-groups/api/size-group.api";

import TDButton from "@/shared/components/td-button";
import { categorySchema, TCategoryFormValues } from "@/features/categories/schemas/category-form.schema";

type Props = {
    defaultValues?: TCategoryFormValues | undefined;
    /** Resolve `false` on failure so the form keeps what was entered. */
    onSubmit: (values: TCategoryFormValues) => Promise<boolean> | boolean;
    isSubmitting?: boolean;
    onSuccess?: () => void;
    categories: { label: string; value: string }[];
};
export default function CategoryForm({
    defaultValues,
    onSubmit,
    isSubmitting,
    onSuccess,
    categories,
}: Props) {
    const { data: sizeGroups } = useAllSizeGroupsQuery({ limit: "100" });
    const sizeGroupOptions =
        sizeGroups?.result.map((sg) => ({
            label: sg.name,
            value: sg.id,
        })) || [];
    const hookForm = useForm<TCategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: defaultValues ?? {
            name: "",
            sizeGroupId: null,
            parentId: null,
            image: null,
        },
    });

    // Reset and close only once the save has landed: resetting straight
    // away wiped the uploaded image and closed the sheet on a failed save.
    const handleCategorySubmit = async (values: TCategoryFormValues) => {
        // Removing the picture leaves `{ url: "", publicId: "" }`; send that
        // as `null` (clear it) rather than saving "" as the image.
        const image = values.image?.url && values.image.publicId ? values.image : null;
        if (!(await onSubmit({ ...values, image }))) return;
        hookForm.reset();
        onSuccess?.();
    };

    return (
        <Form {...hookForm}>
            <form
                onSubmit={hookForm.handleSubmit(handleCategorySubmit)}
                className="space-y-1.5 bg-white p-5 rounded-md"
            >
                <TDInput
                    form={hookForm}
                    name="name"
                    label="Category Name"
                    required
                />
                <TDCombobox
                    form={hookForm}
                    name="sizeGroupId"
                    label="Size Group"
                    options={sizeGroupOptions}
                />
                <TDCombobox
                    form={hookForm}
                    name="parentId"
                    label="Parent Category"
                    options={categories}
                />

                {/* Only top-level categories get a tile on the home page, so
                    this is worth setting on a parent and optional elsewhere.
                    Without one the tile falls back to a gradient. */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Storefront tile image
                        <span className="ml-1 font-normal text-muted-foreground">
                            (optional)
                        </span>
                    </p>
                    <TDImageUploadField
                        form={hookForm}
                        urlName="image.url"
                        publicIdName="image.publicId"
                        folderName="temp/categories"
                    />
                </div>

                <TDButton
                    type="submit"
                    isLoading={isSubmitting}
                    className="px-5"
                >
                    {defaultValues ? "Update Category" : "Add Category"}
                </TDButton>
            </form>
        </Form>
    );
}
