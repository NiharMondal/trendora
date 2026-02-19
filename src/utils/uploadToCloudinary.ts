export const uploadToCloudinary = async (file: File, folder: string) => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", "trendora_preset");
	formData.append("folder", folder);

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
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
