import TDInput from "@/components/form/TDInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    CreateProductFormValues,
    ZTProductImage,
} from "@/form-schema/product-schema";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function ProductImage() {
    const form = useFormContext<CreateProductFormValues>();
    const { watch, setValue } = form;
    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
    } = useFieldArray({
        control: form.control,
        name: "images",
    });

    // Optional logic: Ensure only one image isMain
    const handleSetMainImage = (index: number) => {
        const currentImages: ZTProductImage[] = form.getValues("images");
        const updatedImages = currentImages.map((img, i) => ({
            ...img,
            isMain: i === index,
        }));
        setValue("images", updatedImages);
    };
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Product Images</h3>
                    <p className="text-xs text-muted-foreground">
                        Provide at least one image
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendImage({ url: "", isMain: false })}
                >
                    <Plus /> Add Image
                </Button>
            </div>

            {imageFields.map((field, index) => (
                <div
                    key={field.id}
                    className="border p-5 rounded-lg space-y-3 relative"
                >
                    <TDInput
                        form={form}
                        name={`images.${index}.url`}
                        label="Image URL"
                        placeholder="https://example.com/image.jpg"
                        required
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer">
                            <Checkbox
                                id={`isMain-${index}`}
                                checked={!!watch(`images.${index}.isMain`)}
                                onCheckedChange={() =>
                                    handleSetMainImage(index)
                                }
                            />
                            <Label
                                htmlFor={`isMain-${index}`}
                                className="text-muted-foreground cursor-pointer"
                            >
                                Main Image
                            </Label>
                        </div>

                        <Button
                            size={"icon-sm"}
                            className="absolute top-1.5 right-2 size-8"
                            type="button"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                            title="Remove Image"
                            disabled={imageFields.length === 1}
                        >
                            <X />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
