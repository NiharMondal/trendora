"use client";

import SpinnerLoading from "@/components/common/spinner-loading";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMyAddressQuery } from "@/redux/api/addressApi";
import { Pen, Trash } from "lucide-react";
import React from "react";
import UpdateAddress from "./update-address";

export default function AddressList() {
	const { data, isLoading } = useMyAddressQuery(undefined);

	if (isLoading) return <SpinnerLoading />;
	return (
		<div className="h-14 rounded-md border flex items-center justify-between px-4">
			<div className="flex items-center gap-x-1.5">
				<span>Nihar Mondal, Barishal</span>
			</div>
			<div className="flex gap-x-2">
				<UpdateAddress />
				<Button variant={"destructive"} size={"sm"}>
					<Trash />
				</Button>
			</div>
		</div>
	);
}
