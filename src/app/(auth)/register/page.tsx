import Container from "@/components/common/container";
import { socialIcon } from "@/helping-data/image";
import Image from "next/image";
import React from "react";
import LoginForm from "../login/login-form";
import RegisterForm from "./register-form";

export default function RegisterPage() {
	return (
		<div className="py-24  bg-gradient-to-br md:bg-gradient-to-r from-primary/30 to-white">
			<Container className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
				{/** left side image */}
				<div className="hidden md:block">
					<Image
						src={socialIcon.signUp}
						width={400}
						height={500}
						alt="login-image"
					/>
				</div>
				{/** form */}
				<RegisterForm />
			</Container>
		</div>
	);
}
