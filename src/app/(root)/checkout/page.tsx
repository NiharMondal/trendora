import Container from "@/components/common/container";
import { Metadata } from "next";
import CheckoutForm from "./checkout-form";

export const metadata: Metadata = {
	title: "Trendora | Checkout",
};
export default function CheckoutPage() {
	return (
		<div className="bg-gray-200">
			<Container className="space-y-5 py-10">
				<h3>Checkout</h3>
				<CheckoutForm />
			</Container>
		</div>
	);
}
