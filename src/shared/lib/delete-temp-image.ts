import { envConfig } from "@/shared/config/env-config";

/**
 * Best-effort cleanup of an upload still in Cloudinary's `temp/` folder, when
 * the user replaces or removes it before saving. Callers guard on the
 * publicId containing `/temp/` — keep that guard; see CLAUDE.md.
 *
 * Failure is deliberately swallowed: an orphaned temp upload costs storage,
 * while throwing here would break the replace/remove the user asked for. It is
 * warned about rather than hidden, and a non-2xx answer counts as a failure
 * too — `fetch` only rejects when the request never got a response.
 */
export const deleteTempImage = async (currentPublicId: string) => {
    try {
        const res = await fetch(`${envConfig.backend_url}/cloudinary/delete-temp`, {
            method: "POST",
            body: JSON.stringify({ publicId: currentPublicId }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            console.warn(
                `[deleteTempImage] cleanup of ${currentPublicId} failed with ${res.status}`,
            );
        }
    } catch (error) {
        console.warn(`[deleteTempImage] cleanup of ${currentPublicId} failed`, error);
    }
};
