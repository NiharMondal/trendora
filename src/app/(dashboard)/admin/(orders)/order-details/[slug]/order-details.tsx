"use client";
import SpinnerLoading from "@/components/common/loading/spinner-loading";
import { Separator } from "@/components/ui/separator";
import { Stepper } from "@/components/ui/stepper";
import { useOrderByIdQuery } from "@/redux/api/orderApi";
import { EnumOrderStatus, getOrderStatusStyles } from "@/utils/order-status";
const steps = [
	{ id: "1", title: "First" },
	{ id: "2", title: "Second" },
	{ id: "3", title: "Third" },
];
export default function OrderDetails({ slug }: { slug: string }) {
	const { data: orderData, isLoading } = useOrderByIdQuery(slug);
	const order = orderData?.result;
	console.log(order);
	if (isLoading) return <SpinnerLoading />;
	return (
		<div className="space-y-5 bg-white padding border-radius">
			<div className="flex items-center justify-between">
				<h3>
					Order Details{" "}
					<span
						className={getOrderStatusStyles(
							order?.orderStatus as EnumOrderStatus,
						)}
					>
						{order?.orderStatus}
					</span>
				</h3>
				<p className="flex items-center gap-x-2">
					Order ID:
					<span className="text-sm font-medium">
						#{order?.orderNumber}
					</span>
				</p>
			</div>
			<Separator className="bg-muted" />
			<div className="grid grid-cols-1 lg:grid-cols-3">
				<div className="lg:col-span-2">
					{order?.items?.map((item) => (
						<div
							key={item.id}
							className="flex justify-between items-center gap-x-2 border border-muted border-radius padding"
						>
							<div className="flex items-center gap-x-2">
								<img
									src={item.product.images[0].url}
									className="size-16 border-radius"
								/>
                                    <div>
									<p>{item.productName}</p>
                                    <p>{Number(item.priceAtPurchase )* item.quantity}</p>
                                    </div>
								
							</div>
                            <div>
                                <p className="font-medium">{item.priceAtPurchase}</p>
                                <p className="text-sm">Qty: {item.quantity}</p>
                            </div>
						</div>
					))}
				</div>
				<div className="lg:col-span-1">
					<Stepper steps={steps} clickable />
				</div>
			</div>
		</div>
	);
}
