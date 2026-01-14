import Footer from "@/components/common/footer";
import Navbar from "@/components/navbar/navbar";
import React from "react";

export default function RootPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <Navbar />
            {children}
            <Footer />
        </section>
    );
}
