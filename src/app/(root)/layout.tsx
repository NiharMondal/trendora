import React from "react";

import Footer from "@/layouts/footer";
import Navbar from "@/layouts/navbar/navbar";

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
