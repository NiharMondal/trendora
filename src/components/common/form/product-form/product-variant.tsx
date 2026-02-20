import TDInput from "@/components/form-input/TDInput";
import TDSelect from "@/components/form-input/TDSelect";
import { Button } from "@/components/ui/button";
import { TProductFormValues } from "@/form-schema/product-schema";

import { productSizeOptions } from "@/helping-data/products";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
type ProductVariantProps = {
    options: {
        label: string;
        value: string;
    }[];
};
export default function ProductVariant({ options }: ProductVariantProps) {
    const form = useFormContext<TProductFormValues>();
    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({
        control: form.control,
        name: "variants",
    });
    return (
        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Product Variants</h3>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        appendVariant({
                            sizeId: "",
                            color: "",
                            price: 0,
                            stock: 0,
                        })
                    }
                >
                    <Plus /> Add Variant
                </Button>
            </div>
            {variantFields.map((field, index) => (
                <div
                    key={field.id}
                    className="border p-4 rounded-lg relative grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1.5"
                >
                    <TDSelect
                        form={form}
                        name={`variants.${index}.sizeId`}
                        label="Size"
                        placeholder="Select Size"
                        options={options}
                        className="w-full"
                        size="sm"
                        required
                    />
                    <TDInput
                        form={form}
                        name={`variants.${index}.color`}
                        label="Color"
                        placeholder="Red"
                        inputSize="sm"
                        required
                    />

                    <TDInput
                        form={form}
                        name={`variants.${index}.price`}
                        type="number"
                        label="Variant Price"
                        placeholder="19.99"
                        inputSize="sm"
                        required
                    />
                    <TDInput
                        form={form}
                        name={`variants.${index}.stock`}
                        type="number"
                        label="Variant Stock"
                        placeholder="50"
                        inputSize="sm"
                        required
                    />

                    <Button
                        size={"icon-sm"}
                        className="absolute top-1.5 right-2 size-8"
                        type="button"
                        variant="destructive"
                        onClick={() => removeVariant(index)}
                        title="Remove Variants"
                    >
                        <X />
                    </Button>
                </div>
            ))}
        </div>
    );
}
