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
	return {
		url: data.secure_url,
		publicId: data.public_id,
	};
};
