"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import TDSeparator from "@/shared/components/td-separator";
import TDCheckbox from "@/shared/form/TDCheckbox";
import TDCombobox from "@/shared/form/TDCombobox";
import TDInput from "@/shared/form/TDInput";
import TDSelect from "@/shared/form/TDSelect";
import TDTextArea from "@/shared/form/TDTextArea";
import { Form } from "@/shared/ui/form";
import { useAllBrandQuery } from "@/features/brands/api/brand.api";
import {
    useAllCategoryQuery,
    useCategoryByIdQuery,
} from "@/features/categories/api/category.api";

import { productGenderOptions } from "@/shared/constants/mock-products";
import TDButton from "@/shared/components/td-button";
import ImageVariant from "./image-variant";
import { productSchema, TProductFormValues } from "@/features/products/schemas/product-form.schema";
import ProductVariant from "./product-variant";

type ProductFormProps = {
    productId?: string;
    defaultValues?: TProductFormValues;
    onSubmit: (values: TProductFormValues) => Promise<void> | void;
    isLoading: boolean;
    /**
     * Stores to choose from. Passed ONLY by the admin create page — an admin
     * must name the store a product belongs to, since they do not own one.
     * A vendor never sees this field: the backend assigns their own store.
     */
    vendorOptions?: { label: string; value: string }[];
    /** Show the "submit for review" checkbox (create flow only). */
    showSubmitForReview?: boolean;
};
export default function ProductForm({
    productId,
    defaultValues,
    onSubmit,
    isLoading,
    vendorOptions,
    showSubmitForReview,
}: ProductFormProps) {
    const [categoryId, setCategoryId] = useState(
        defaultValues?.categoryId || "",
    );

    const { data: categories } = useAllCategoryQuery({ limit: "100" });
    const { data: brands } = useAllBrandQuery({ limit: "100" });
    const categoryOption = categories?.result?.map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const { data: categoryDetails } = useCategoryByIdQuery(categoryId, {
        skip: !categoryId,
    });
    const sizeGroupOptions = categoryDetails?.result?.sizeGroup?.sizes?.map(
        (size) => ({
            label: size.name,
            value: size.id,
        }),
    );
    const brandOption = brands?.result?.map((brand) => ({
        label: brand.name,
        value: brand.id,
    }));
    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: defaultValues ?? {
            name: "",
            basePrice: 0,
            discountPrice: undefined,
            categoryId: "",
            description: "",
            gender: "",
            stockQuantity: 200,
            isFeatured: false,
            brandId: "",
            vendorId: "",
            submitForReview: true,
            variants: [{ stock: 0, price: 0, color: "", sizeId: "" }],
            images: [{ isMain: true, url: "" }],
        },
    });

    const handleCategoryChange = (value: string) => {
        setCategoryId(value);
    };
    const handleProductSubmit = (values: TProductFormValues) => {
        onSubmit(values);
    };
    useEffect(() => {
        if (defaultValues) {
            setCategoryId(defaultValues.categoryId);
        }
    }, [defaultValues]);

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-5"
                onSubmit={form.handleSubmit(handleProductSubmit)}
            >
                <div className="bg-white rounded-md p-5 space-y-5">
                    <h5 className="text-lg font-semibold">
                        Product Information
                    </h5>
                    <TDInput
                        form={form}
                        label="Product name"
                        name="name"
                        required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-1.5">
                        <TDInput
                            form={form}
                            label="Price"
                            name="basePrice"
                            type="number"
                            placeholder="120.99"
                            required
                        />
                        <TDInput
                            form={form}
                            label="Discount price"
                            name="discountPrice"
                            type="number"
                        />
                        <TDInput
                            form={form}
                            label="Stock quantity"
                            name="stockQuantity"
                            type="number"
                            required
                        />
                        <TDCombobox
                            form={form}
                            label="Category"
                            name="categoryId"
                            placeholder="Select category"
                            searchPlaceholder="Search categories..."
                            emptyText="No category found."
                            options={categoryOption || []}
                            onChange={handleCategoryChange}
                            required
                        />
                        <TDCombobox
                            form={form}
                            label="Brand"
                            name="brandId"
                            placeholder="Select Brand"
                            searchPlaceholder="Search categories..."
                            emptyText="No Brand found."
                            required
                            options={brandOption || []}
                        />
                        <TDSelect
                            form={form}
                            name="gender"
                            options={productGenderOptions}
                            label="Gender"
                            className="w-full"
                        />
                        {/* Admin-only: a product cannot exist without a store,
                            and an admin has to say which one. */}
                        {vendorOptions && (
                            <TDCombobox
                                form={form}
                                label="Store"
                                name="vendorId"
                                placeholder="Select store"
                                searchPlaceholder="Search stores..."
                                emptyText="No store found."
                                options={vendorOptions}
                                required
                            />
                        )}
                    </div>

                    <TDTextArea
                        form={form}
                        label="Product description"
                        name="description"
                        placeholder="Write description here..."
                        required
                    />

                    <div className="border p-4 rounded-md space-y-4">
                        <TDCheckbox
                            form={form}
                            name="isFeatured"
                            label="Featured Product"
                            description="Enable this to mark as a featured item"
                        />
                        {showSubmitForReview && (
                            <TDCheckbox
                                form={form}
                                name="submitForReview"
                                label="Submit for review now"
                                description="Send this listing to the admin review queue. Leave it off to keep it as a draft — either way it is not visible to shoppers until it has been approved and published."
                            />
                        )}
                    </div>
                </div>

                <div className="bg-white shadow rounded-md  p-5 space-y-5">
                    {/** product images */}
                    <ImageVariant />
                    {/** separator */}
                    <TDSeparator className="my-10" />

                    {/** product variants */}
                    <ProductVariant options={sizeGroupOptions || []} />
                    <TDButton type="submit" isLoading={isLoading}>
                        {productId ? "Update Product" : "Create Product"}
                    </TDButton>
                </div>
            </form>
        </Form>
    );
}
