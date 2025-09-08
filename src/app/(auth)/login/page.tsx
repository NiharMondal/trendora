import React from "react";
import LoginForm from "./login-form";
import Image from "next/image";
import { socialIcon } from "@/helping-data/image";
import Container from "@/components/common/container";

export default function LoginPage() {
	return (
		<div className="py-24 md:py-32 bg-gradient-to-br md:bg-gradient-to-r from-primary/30 to-white">
			<Container className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
				{/** left side image */}
				<div className="hidden md:block">
					<Image
						src={socialIcon.secureLogin}
						width={400}
						height={500}
						alt="login-image"
					/>
				</div>
				{/** form */}
				<LoginForm />
			</Container>
		</div>
	);
}
