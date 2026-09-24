import { Metadata } from "next";

import AboutUs from "@/features/home/components/about-us";

export const metadata: Metadata = {
    title: "About Us | Trendora",
    description:
        "Trendora is a multi-vendor fashion marketplace: independent stores, one checkout.",
};

export default function AboutUsPage() {
    return <AboutUs />;
}
