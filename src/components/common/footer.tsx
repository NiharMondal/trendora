import React from "react";
import Container from "./container";
import { footerInfo, order, ourPolicies } from "@/helping-data/footer";
import Link from "next/link";
import { Input } from "../ui/input";
import { Mail } from "lucide-react";
import Image from "next/image";
import facebook from "../../assets/icons/facebook.svg";
import { socialIcon } from "@/helping-data/image";
export default function Footer() {
	return (
		<footer className="py-10">
			<Container className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-0">
				<div className="grid grid-cols-2  md:grid-cols-3 gap-8">
					<div className="space-y-2">
						<h4>Info</h4>
						<ul className="text-neutral-dark">
							{footerInfo.map((info) => (
								<li key={info.label}>
									<Link
										href={info.path}
										className="hover:text-primary duration-300 font-normal tracking-wide"
									>
										{info.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="space-y-2">
						<h4>Our Policies</h4>
						<ul className="text-neutral-dark">
							{ourPolicies.map((info) => (
								<li key={info.label}>
									<Link
										href={info.path}
										className="hover:text-primary duration-300 font-normal tracking-wide"
									>
										{info.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="space-y-2">
						<h4>Order</h4>
						<ul className="text-neutral-dark">
							{order.map((info) => (
								<li key={info.label}>
									<Link
										href={info.path}
										className="hover:text-primary duration-300 font-normal tracking-wide"
									>
										{info.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="space-y-2">
						<h4>Store</h4>
						<p className="text-neutral-dark">
							2548 Broaddus Maple Court Avenue, Madisonville KY
							4783, United States of America
						</p>

						<p className="mt-5 text-neutral-dark">
							Call Us: <b>1–234–5678901</b> <br /> Mon-Sun: 9:00am
							- 9:00pm
						</p>
					</div>
					<div className="space-y-2">
						<h4>Subscribe to Our Newsletter!</h4>

						<div className="flex items-center justify-between bg-white shadow gap-x-2 px-2 py-1 rounded">
							<input
								type="text"
								placeholder="Enter your e-mail"
								className="border-none outline-none py-2 placeholder:text-lg placeholder:font-semibold placeholder:text-muted"
							/>
							<Mail />
						</div>
						<p className="text-neutral-dark">
							By entering your email, you agree to our Terms of
							Service and Privacy Policy.
						</p>

						<div className="flex items-center justify-between mt-5">
							<h5>Follow Us:</h5>
							<ul className="flex items-center gap-x-4 *:opacity-50 *:hover:opacity-80">
								<li>
									<Image
										src={socialIcon.facebook}
										width={20}
										height={20}
										alt="facebook"
									/>
								</li>
								<li>
									<Image
										src={socialIcon.twitter}
										width={20}
										height={20}
										alt="twitter"
									/>
								</li>
								<li>
									<Image
										src={socialIcon.instagram}
										width={20}
										height={20}
										alt="instagram"
									/>
								</li>
								<li>
									<Image
										src={socialIcon.youtube}
										width={20}
										height={20}
										alt="youtube"
									/>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</Container>
		</footer>
	);
}
