import React from "react";
import AddressList from "./address-list";
import CreateAddress from "./create-address";

export default function AddressPage() {
	return (
		<div className="space-y-5 bg-white p-5 lg:p-10 rounded-2xl shadow">
			<AddressList />
			<CreateAddress />
		</div>
	);
}
