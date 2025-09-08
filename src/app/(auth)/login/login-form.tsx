"use client";
import TDInput from "@/components/form/TDInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { login } from "@/form-schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import React from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
	const form = useForm({
		resolver: zodResolver(login),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	return (
		<div className="border rounded-md shadow-md p-10">
			<Form {...form}>
				<form className="space-y-4">
					<TDInput
						form={form}
						label="Email"
						type="email"
						name="email"
						placeholder="Enter your email"
					/>
					<TDInput
						form={form}
						type="password"
						label="Password"
						name="password"
						placeholder="Enter your password"
					/>
					<div>
						<Link
							href={"/forgot-password"}
							className="text-muted hover:underline font-normal text-sm"
						>
							Forgot your password?
						</Link>
					</div>
					<Button className="w-full cursor-pointer">Sign In</Button>
				</form>
			</Form>
			<div className="mt-10">
				<p className="text-center">
					Don't have an account?{" "}
					<Link
						href={"/register"}
						className="font-semibold text-accent hover:underline "
					>
						Sign Up
					</Link>{" "}
				</p>
			</div>
		</div>
	);
}
