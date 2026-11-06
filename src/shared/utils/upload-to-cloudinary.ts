import { envConfig } from "@/shared/config/env-config";

export const uploadToCloudinary = async (file: File, folder: string) => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append(
        "upload_preset",
        envConfig.cloudinary_preset_name,
    );
	formData.append("folder", `trendora/${folder}`);

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${envConfig.cloudinary_cloud_name}/image/upload`,
		{
			method: "POST",
			body: formData,
		},
	);

	const data = await res.json();
	// Cloudinary answers a rejected upload with `{ error: { message } }` and
	// no `secure_url`; returning that would save `undefined` as the image.
	if (!res.ok || !data.secure_url || !data.public_id) {
		throw new Error(data?.error?.message || "Image upload failed");
	}
	return {
		url: data.secure_url,
		publicId: data.public_id,
	};
};
