import Footer from "@/components/common/footer";
import Navbar from "@/components/layout/navbar";
import React from "react";

export default function AuthLayout({
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
