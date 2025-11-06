import Image from "next/image";
import React from "react";
import noFoundImage from "../../assets/images/no-data-found.jpg";

export default function NoDataFound() {
	return (
		<div className="flex py-10 items-center justify-center ">
			<Image
				src={noFoundImage}
				alt="No-data-found"
				width={200}
				height={200}
				className="aspect-square rounded-xl overflow-hidden"
			/>
		</div>
	);
}
