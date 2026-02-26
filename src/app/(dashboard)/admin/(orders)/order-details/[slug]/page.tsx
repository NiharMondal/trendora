import OrderDetails from "./order-details";

export default async function OrderDetailsPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	return <OrderDetails slug={slug} />;
}
