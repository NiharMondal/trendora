import React from "react";

export default function TopBar() {
	return (
		<div className="py-3 grid grid-cols-1  lg:grid-cols-3">
			<p className="text-center lg:text-left text-muted">
				Call Us:{" "}
				<span className="font-semibold text-black">012318971</span>
			</p>
			<p className="text-center">
				{" "}
				<span className="text-black font-semibold">50% off</span> for
				all new collection
			</p>
			<ul className="hidden lg:flex items-center justify-end gap-x-8 *:tracking-wide text-muted">
				<li>Facebook</li>
				<li>Twitter</li>
				<li>Instagram</li>
			</ul>
		</div>
	);
}
