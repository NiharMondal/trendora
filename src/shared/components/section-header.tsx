import React from "react";

type SectionHeaderProps = {
	title: string;
};

export default function SectionHeader({ title }: SectionHeaderProps) {
	return (
		<div className="flex items-center justify-center gap-x-2 lg:gap-x-5">
			<hr className="border-b border-neutral-dark/60 flex-grow mt-1" />
			<h4 className="uppercase tracking-wider font-bold">{title}</h4>
			<hr className="border-b border-neutral-dark/60 flex-grow mt-1" />
		</div>
	);
}
