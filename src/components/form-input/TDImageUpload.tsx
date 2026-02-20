"use client";

import React, { useRef, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { toast } from "sonner";


type Props<T extends FieldValues> = {
	form: UseFormReturn<T>;
	urlName: Path<T>;
	publicIdName: Path<T>;
};

export default function TDImageUploadField<T extends FieldValues>({
	form,
	urlName,
	publicIdName,
}: Props<T>) {
	const fileRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);

	const url = form.watch(urlName);


	const handleUpload = async (file: File) => {
		try {
			setLoading(true);
			const uploaded = await uploadToCloudinary(
				file,
				"trendora/temp/products",
			);

			form.setValue(urlName, uploaded.url);
			form.setValue(publicIdName, uploaded.publicId);

			toast.success("Image uploaded successfully!");
		} catch (error: any) {
			console.error("Upload failed:", error);
			form.setValue(urlName, "" as any);
			form.setValue(publicIdName, "" as any);
			if (fileRef.current) fileRef.current.value = "";

			// Show error to user
			toast.error(error?.message || "Failed to upload image");
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (file: File) => {
		if (file.size > 2 * 1024 * 1024) {
			toast.error("File is too big. Maximum size is 2MB.");
			return;
		}
		handleUpload(file);
	};
	const handleRemove = () => {
		form.setValue(urlName, "" as any);
		form.setValue(publicIdName, "" as any);
		if (fileRef.current) fileRef.current.value = "";
		toast("Image removed");
	};

	return (
		<div className="space-y-2">
			{url ? (
				<div className="relative w-full h-40">
					<Image
						src={url}
						alt="Preview"
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover rounded-md border"
					/>
					<button
						type="button"
						onClick={handleRemove}
						className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
					>
						<X size={14} />
					</button>
				</div>
			) : (
				<Button
					type="button"
					variant="outline"
					onClick={() => fileRef.current?.click()}
					disabled={loading}
				>
					{loading ? "Uploading..." : "Upload Image"}
				</Button>
			)}

			<input
				ref={fileRef}
				type="file"
				accept="image/*"
				hidden
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFileChange(file);
				}}
			/>
		</div>
	);
}
