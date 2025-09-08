"use client";
import TDInput from "@/components/form/TDInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { register } from "@/form-schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function RegisterForm() {
	const form = useForm({
		resolver: zodResolver(register),
		defaultValues: {
			name: "",
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
						label="Fullname"
						name="name"
						placeholder="Enter your fullname"
					/>
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
					<Button className="w-full cursor-pointer">
						Create Account
					</Button>
				</form>
			</Form>
			<div className="mt-10">
				<p className="text-center">
					Already have an account?{" "}
					<Link
						href={"/login"}
						className="font-semibold text-accent hover:underline "
					>
						Sign In
					</Link>{" "}
				</p>
			</div>
		</div>
	);
}
