import { Metadata } from "next";
import { Suspense } from "react";

import SlideTable from "@/features/home/components/slides/slide-table";

export const metadata: Metadata = {
    title: "Trendora | Hero Slides",
};

export default function SlideListPage() {
    return (
        <Suspense>
            <SlideTable />
        </Suspense>
    );
}
