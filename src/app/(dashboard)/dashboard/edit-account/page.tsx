import React from "react";
import AccountForm from "./account-form";
import Image from "next/image";

export default function EditAccount() {
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
				<div className="order-first lg:order-last h-[300px] bg-gray-400 rounded shadow col-span-full lg:col-span-1 "></div>
			</div>
		</div>
	);
}
