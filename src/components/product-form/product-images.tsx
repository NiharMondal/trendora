import TDInput from "@/components/form-input/TDInput";
import { Button } from "@/components/ui/button";
import { CreateProductInput } from "@/form-schema/product-schema";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

interface Props {
    form: UseFormReturn<CreateProductInput>;
    imageArray: UseFieldArrayReturn<CreateProductInput, "images", "id">;
    handleSetMainImage: (index: number) => void;
}

export default function ProductImages({
    form,
    imageArray,
    handleSetMainImage,
}: Props) {
    const { fields, append, remove } = imageArray;
    const { watch } = form;

    return (
        <div className="bg-white shadow-md p-8 rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Product Images</h3>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ url: "", isMain: false })}
                >
                    + Add Image
                </Button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg space-y-3">
                    <TDInput
                        form={form}
                        name={`images.${index}.url`}
                        label="Image URL"
                        placeholder="https://example.com/image.jpg"
                        required
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={
                                    watch(`images.${index}.isMain`) || false
                                }
                                onChange={() => handleSetMainImage(index)}
                            />
                            <label>Main Image</label>
                        </div>

                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
