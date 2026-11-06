import { ImageIcon, Plus, Star, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import TDImageUploadField from "@/shared/form/TDImageUpload";
import TDInput from "@/shared/form/TDInput";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";

import { TProductFormValues, TProductImage } from "@/features/products/schemas/product-form.schema";

export default function ImageVariant() {
    const form = useFormContext<TProductFormValues>();
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
        const currentImages: TProductImage[] = form.getValues("images");
        const updatedImages = currentImages.map((img, i) => ({
            ...img,
            isMain: i === index,
        }));
        setValue("images", updatedImages);
    };
    const imagesError = form.formState.errors.images;
    const imagesErrorMessage = imagesError
        ? typeof imagesError === "string"
            ? imagesError
            : imagesError.message || "At least one image is required"
        : null;

    const addImage = () =>
        appendImage({
            url: "",
            publicId: "",
            altText: "",
            isMain: false,
        });

    return (
        <section className="space-y-4">
            <header className="flex flex-wrap items-end justify-between gap-3 border-b pb-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="size-5 text-primary" />
                        <h3 className="text-lg font-semibold">Product Images</h3>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {imageFields.length}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Add at least one image. The main image is shown on
                        product cards and listings.
                    </p>
                    {imagesErrorMessage && (
                        <p className="text-xs text-destructive">
                            {imagesErrorMessage}
                        </p>
                    )}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addImage}>
                    <Plus /> Add Image
                </Button>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {imageFields.map((field, index) => {
                    const isMain = !!watch(`images.${index}.isMain`);
                    return (
                        <div
                            key={field.id}
                            className={cn(
                                "flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs transition-colors",
                                isMain &&
                                    "border-primary ring-2 ring-primary/20",
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Image {index + 1}
                                </span>
                                {isMain && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                                        <Star className="size-3 fill-current" />
                                        Main
                                    </span>
                                )}
                            </div>

                            <TDImageUploadField
                                form={form}
                                folderName="temp/products" // save image in temp folder
                                urlName={`images.${index}.url`}
                                publicIdName={`images.${index}.publicId`}
                            />

                            <TDInput
                                form={form}
                                name={`images.${index}.altText`}
                                label="Alt Text"
                                placeholder="e.g. Front view, navy blue"
                                inputSize="sm"
                            />

                            <div className="mt-auto flex items-center justify-between border-t pt-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id={`isMain-${index}`}
                                        checked={isMain}
                                        onCheckedChange={() =>
                                            handleSetMainImage(index)
                                        }
                                    />
                                    <Label
                                        htmlFor={`isMain-${index}`}
                                        className="cursor-pointer text-sm text-muted-foreground"
                                    >
                                        Set as main
                                    </Label>
                                </div>
                                {index !== 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        className="text-muted-foreground hover:bg-destructive-50 hover:text-destructive"
                                        onClick={() => removeImage(index)}
                                        title="Remove image"
                                        aria-label={`Remove image ${index + 1}`}
                                    >
                                        <Trash2 />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={addImage}
                    className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:bg-primary-50/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                >
                    <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <Plus className="size-5" />
                    </span>
                    <span className="text-sm font-medium">Add another image</span>
                </button>
            </div>
        </section>
    );
}
