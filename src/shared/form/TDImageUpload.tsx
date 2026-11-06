"use client";

import { CloudUpload, X } from "lucide-react";
import Image from "next/image";
import { type DragEvent, useRef, useState } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { uploadToCloudinary } from "@/shared/utils/upload-to-cloudinary";

import { deleteTempImage } from "@/shared/lib/delete-temp-image";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

/**
 * Clearing an image writes "" to its url/publicId fields. react-hook-form cannot
 * prove "" fits an arbitrary `Path<T>`, so it is cast once, typed as the path's
 * own value rather than `any`.
 */
const EMPTY = "";

/** Client-side guards only — Cloudinary's unsigned preset is the real limit. */
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_TYPES = "image/*";

type Props<T extends FieldValues> = {
    form: UseFormReturn<T>;
    urlName: Path<T>;
    publicIdName: Path<T>;
    className?: string;
    folderName: string;
};

export default function TDImageUploadField<T extends FieldValues>({
    form,
    urlName,
    publicIdName,
    className,
    folderName,
}: Props<T>) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const url = form.watch(urlName);

    const handleUpload = async (file: File) => {
        try {
            setLoading(true);

            // If there's already a temp image loaded, delete it first
            const currentPublicId = form.getValues(publicIdName);
            if (currentPublicId && String(currentPublicId).includes("/temp/")) {
                await deleteTempImage(currentPublicId);
            }
            const uploaded = await uploadToCloudinary(file, folderName);

            form.setValue(urlName, uploaded.url);
            form.setValue(publicIdName, uploaded.publicId);

            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            form.setValue(urlName, EMPTY as PathValue<T, Path<T>>);
            form.setValue(publicIdName, EMPTY as PathValue<T, Path<T>>);
            if (fileRef.current) fileRef.current.value = "";

            // Show error to user
            toast.error(
                error instanceof Error && error.message
                    ? error.message
                    : "Failed to upload image",
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * The one choke point every file passes through, whichever way it arrived.
     * `accept="image/*"` on the input only filters the OS dialog — the user can
     * switch it back to "All Files" — and it has no effect whatsoever on a
     * drop, so the type check has to live here rather than on the input. A file
     * the OS cannot type at all (empty `file.type`) is not a proven image and
     * is refused too.
     */
    const handleFileChange = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files can be uploaded");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error("File is too big. Maximum size is 2MB.");
            return;
        }

        handleUpload(file);
    };

    /**
     * HTML5 drag-and-drop: every element refuses file drops until `dragover` is
     * cancelled — without the preventDefault below, `onDrop` never fires at all
     * and the browser just navigates to the dropped file. The file itself is
     * unreadable until `drop` — the data store is protected while dragging —
     * so nothing can be validated before then; `handleFileChange` does it.
     */
    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!loading) setIsDragging(true);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = loading ? "none" : "copy";
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        // dragleave also fires when the cursor crosses into a child, which
        // would make the highlight flicker; ignore those.
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (loading) return;

        // Dragging an image out of another browser tab carries a URL, not a
        // file, so `files` is empty — say so instead of doing nothing.
        const file = e.dataTransfer.files?.[0];
        if (!file) {
            toast.error("Drop an image file from your computer");
            return;
        }

        handleFileChange(file);
    };

    const handleRemove = async () => {
        const currentPublicId = form.getValues(publicIdName);

        // Delete from Cloudinary if it's a temp image
        if (currentPublicId && String(currentPublicId).includes("/temp/")) {
            await deleteTempImage(currentPublicId);
        }

        form.setValue(urlName, EMPTY as PathValue<T, Path<T>>);
        form.setValue(publicIdName, EMPTY as PathValue<T, Path<T>>);
        if (fileRef.current) fileRef.current.value = "";
        toast("Image removed");
    };

    return (
        <div className="space-y-2">
            {/* Drag-and-drop is a mouse enhancement — there is no keyboard way
                to drag a file — and the keyboard path is the "click to browse"
                button inside. So the drop listeners here are deliberate. */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <div
                role="group"
                aria-label="Image upload"
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative w-full h-36 border rounded-md bg-gray-100 transition-colors duration-150",
                    isDragging &&
                        "border-2 border-dashed border-primary bg-primary-50",
                )}
            >
                {url ? (
                    <>
                        <Image
                            src={url}
                            alt="Preview"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded-md w-full"
                            priority={true}
                        />
                        <button
                            type="button"
                            aria-label="Remove image"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className={cn(
                            "w-full h-full flex items-center justify-center cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-primary",
                            className,
                        )}
                        onClick={() => fileRef.current?.click()}
                    >
                        <span className="text-muted-foreground text-sm text-center px-2">
                            {isDragging
                                ? "Drop to upload"
                                : "Drop an image here, or click to browse"}
                        </span>
                    </button>
                )}
                {form.formState.errors[urlName] && (
                    <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors[urlName]?.message as string}
                    </p>
                )}
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={loading}
                className="w-full flex items-center gap-2"
            >
                {loading ? (
                    "Uploading..."
                ) : (
                    <>
                        <CloudUpload /> <span>Upload Image</span>
                    </>
                )}
            </Button>

            <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED_TYPES}
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    // Reset so re-picking the same file after a rejection still
                    // fires change.
                    e.target.value = "";
                    if (file) handleFileChange(file);
                }}
            />
        </div>
    );
}
