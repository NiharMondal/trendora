export const uploadToCloudinary = async (file: File, folder: string) => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append(
        "upload_preset",
        `${process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}`,
    );
	formData.append("folder", `trendora/${folder}`);

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
