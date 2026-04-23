import { envConfig } from "@/config/env-config";

export const deleteTempImage = async (currentPublicId: string) => {
    try {
        await fetch(`${envConfig.backend_url}/cloudinary/delete-temp`, {
            method: "POST",
            body: JSON.stringify({ publicId: currentPublicId }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.log(error);
    }
};
