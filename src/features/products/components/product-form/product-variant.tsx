import { Info, Layers, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import TDInput from "@/shared/form/TDInput";
import TDSelect from "@/shared/form/TDSelect";
import { Button } from "@/shared/ui/button";

import { TProductFormValues } from "@/features/products/schemas/product-form.schema";
type ProductVariantProps = {
    options: {
        label: string;
        value: string;
    }[];
    /**
     * Why no size can be picked yet (no category chosen, still loading, or a
     * category without a size group). While set, the size selects are
     * disabled and this is shown above the variants.
     */
    sizeHint?: string;
};
export default function ProductVariant({
    options,
    sizeHint,
}: ProductVariantProps) {
    const form = useFormContext<TProductFormValues>();
    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    const addVariant = () =>
        appendVariant({
            sizeId: "",
            color: "",
            price: 0,
            stock: 0,
        });

    return (
        <section className="space-y-4">
            <header className="flex flex-wrap items-end justify-between gap-3 border-b pb-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <Layers className="size-5 text-primary" />
                        <h3 className="text-lg font-semibold">
                            Product Variants
                        </h3>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {variantFields.length}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Each size and color combination with its own price
                        and stock.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariant}
                >
                    <Plus /> Add Variant
                </Button>
            </header>

            {sizeHint && (
                <p
                    role="status"
                    className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
                >
                    <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                    {sizeHint}
                </p>
            )}

            <div className="space-y-3">
                {variantFields.map((field, index) => {
                    const color = form.watch(`variants.${index}.color`);
                    return (
                        <div
                            key={field.id}
                            className="rounded-xl border bg-card shadow-xs transition-colors hover:border-primary/40"
                        >
                            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm font-medium">
                                        Variant {index + 1}
                                    </span>
                                    {color && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                                            <span
                                                aria-hidden
                                                className="size-2.5 rounded-full border"
                                                style={{ backgroundColor: color }}
                                            />
                                            {color}
                                        </span>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-muted-foreground hover:bg-destructive-50 hover:text-destructive"
                                    onClick={() => removeVariant(index)}
                                    title="Remove variant"
                                    aria-label={`Remove variant ${index + 1}`}
                                >
                                    <Trash2 />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-x-4 gap-y-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
                                <TDSelect
                                    form={form}
                                    name={`variants.${index}.sizeId`}
                                    label="Size"
                                    placeholder={
                                        sizeHint
                                            ? "Choose a category first"
                                            : "Select Size"
                                    }
                                    options={options}
                                    disabled={!!sizeHint}
                                    emptyText="No sizes for this category"
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
                            </div>
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={addVariant}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary-50/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                >
                    <Plus className="size-4" />
                    {variantFields.length === 0
                        ? "No variants yet. Add a size and color"
                        : "Add another variant"}
                </button>
            </div>
        </section>
    );
}
