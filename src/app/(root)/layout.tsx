import Footer from "@/components/common/footer";
import { QuickLink } from "@/components/common/quicklink";
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
			<QuickLink />
			{children}
			<Footer />
		</section>
	);
}
