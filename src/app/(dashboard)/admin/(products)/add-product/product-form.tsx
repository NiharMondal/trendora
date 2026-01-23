"use client";
import TDSeparator from "@/components/common/@ui/td-separator";
import TDButton from "@/components/common/td-button";
import TDCheckbox from "@/components/form/TDCheckbox";
import TDCombobox from "@/components/form/TDCombobox";
import TDInput from "@/components/form/TDInput";
import TDTextArea from "@/components/form/TDTextArea";
import { Form } from "@/components/ui/form";
import {
    CreateProductFormValues,
    createProductSchema,
} from "@/form-schema/product-schema";
import { useCreateProductMutation } from "@/redux/api/productApi";
import { useAllCategoryQuery } from "@/redux/api/productCategoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ProductImage from "./product-image";
import ProductVariant from "./product-variant";

export default function ProductForm() {
    const { data: categories } = useAllCategoryQuery({});

    const categoryOption = categories?.result?.map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const [createProduct, { isLoading }] = useCreateProductMutation();

    const form = useForm({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            basePrice: 0,
            discountPrice: "",
            categoryId: "",
            description: "",
            stockQuantity: 200,
            isFeatured: false,

            variants: [{ stock: 0, price: 0, color: "", size: "" }],
            images: [{ isMain: true, url: "" }],
        },
    });

    const handleCreateProduct = async (values: CreateProductFormValues) => {
        console.log(values);
        try {
            await createProduct(values).unwrap();
            toast.success("Product created successfully");
        } catch (error: any) {
            console.log(error);
            toast.error(error?.data.message);
        }
    };

    return (
        <Form {...form}>
            <form
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                onSubmit={form.handleSubmit(handleCreateProduct)}
            >
                <div className="bg-white shadow rounded-2xl p-5 space-y-1.5">
                    <TDInput
                        form={form}
                        label="Product name"
                        name="name"
                        required
                    />
                    <TDInput
                        form={form}
                        label="Price"
                        name="basePrice"
                        type="number"
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
                        className=""
                        required
                        options={[
                            { label: "Shirt", value: "1" },
                            { label: "Pants", value: "2" },
                        ]}
                    />
                    <TDTextArea
                        form={form}
                        label="Product description"
                        name="description"
                        placeholder="Write description here..."
                        required
                    />
                </div>

                <div className="bg-white shadow rounded-2xl  p-5 space-y-5">
                    <div className="border p-4 rounded-md">
                        <TDCheckbox
                            form={form}
                            name="isFeatured"
                            label="Featured Product"
                            description="Enable this to mark as a featured item"
                        />
                    </div>
                    {/** product variants */}
                    <ProductVariant />
                    {/** separator */}
                    <TDSeparator className="my-10" />
                    {/** product images */}
                    <ProductImage />

                    <TDButton
                        type="submit"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        Add Product
                    </TDButton>
                </div>
            </form>
        </Form>
    );
}
