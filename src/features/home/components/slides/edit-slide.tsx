"use client";

import { toast } from "sonner";

import {
    useSlideByIdQuery,
    useUpdateSlideMutation,
} from "@/features/home/api/slide.api";
import { TSlideFormValues } from "@/features/home/schemas/slide-form.schema";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import QueryError from "@/shared/components/query-error";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import SlideForm from "./slide-form";

type Props = {
    slideId: string;
    onClose: () => void;
};

export default function EditSlide({ slideId, onClose }: Props) {
    const { data, isLoading, error, refetch } = useSlideByIdQuery(slideId);
    const [updateSlide, { isLoading: isUpdating }] = useUpdateSlideMutation();

    const slide = data?.result;

    const handleUpdate = async (values: TSlideFormValues) => {
        try {
            await updateSlide({ id: slideId, payload: values }).unwrap();
            toast.success("Slide updated");
            onClose();
            return true;
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Could not update the slide"));
            return false;
        }
    };

    if (isLoading) return <SpinnerLoading />;
    // Never render the form on a failed load — its defaults would be saved
    // over the real slide (FE-06).
    if (error || !slide) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load this slide"
            />
        );
    }

    return (
        <SlideForm
            // Remount per slide so the form picks up the right defaults.
            key={slide.id}
            defaultValues={{
                title: slide.title,
                subtitle: slide.subtitle,
                photo: {
                    url: slide.photoUrl,
                    publicId: slide.photoPublicId ?? "",
                },
                url: slide.url,
                sortOrder: slide.sortOrder,
                isActive: slide.isActive,
            }}
            onSubmit={handleUpdate}
            isSubmitting={isUpdating}
        />
    );
}
