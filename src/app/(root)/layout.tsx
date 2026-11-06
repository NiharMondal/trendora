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
            <main id="main-content" tabIndex={-1} className="outline-none">{children}</main>
            <Footer />
        </section>
    );
}
