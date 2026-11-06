import { Metadata } from "next";

import Headline from "@/shared/components/headline";
import AddSlide from "@/features/home/components/slides/add-slide";

export const metadata: Metadata = {
    title: "Trendora | Add Slide",
};

export default function AddSlidePage() {
    return (
        <div className="space-y-5">
            <Headline title="Add Slide" showBackButton />
            <AddSlide />
        </div>
    );
}
