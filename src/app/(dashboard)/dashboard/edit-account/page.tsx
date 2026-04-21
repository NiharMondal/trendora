"use client";
import React from "react";

import AccountForm from "./account-form";
import { useMyProfileQuery } from "@/redux/api/userApi";

export default function EditAccount() {
	const {data} = useMyProfileQuery(undefined);
	console.log(data)
	return (
		<div className="space-y-5">
			<div className="space-y-0.5">
				<h4>Your Account Information</h4>
				<p className="text-sm text-gray-500 font-normal">
					You can update your account Information anytime
				</p>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-8">
				<AccountForm />
				
			</div>
		</div>
	);
}
