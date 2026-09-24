"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateSlideMutation } from "@/features/home/api/slide.api";
import { TSlideFormValues } from "@/features/home/schemas/slide-form.schema";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import SlideForm from "./slide-form";

export default function AddSlide() {
    const router = useRouter();
    const [createSlide, { isLoading }] = useCreateSlideMutation();

    const handleCreate = async (values: TSlideFormValues) => {
        try {
            await createSlide(values).unwrap();
            toast.success("Slide created");
            router.push("/admin/slide-list");
            return true;
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not create the slide"));
            return false;
        }
    };

    return <SlideForm onSubmit={handleCreate} isSubmitting={isLoading} />;
}
