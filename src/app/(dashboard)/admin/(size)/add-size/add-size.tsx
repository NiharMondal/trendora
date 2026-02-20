"use client";
import SizeForm from "@/components/common/form/size-form/size-form";

export default function AddSize() {
	return (
		<div>
			<SizeForm
				onSubmit={(values) => {
					console.log(values);
				}}
			/>
		</div>
	);
}
