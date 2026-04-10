import React from "react";

import Footer from "@/components/common/shared/footer";
import Navbar from "@/components/layout/navbar/navbar";

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
