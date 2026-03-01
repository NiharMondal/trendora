"use client";
import RowText from "@/components/common/@ui/row-text";
import TDSeparator from "@/components/common/@ui/td-separator";
import SpinnerLoading from "@/components/common/loading/spinner-loading";
import { Stepper } from "@/components/ui/stepper";
import { cn } from "@/lib/utils";
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
	console.log(order?.shippingSnapshot)
	const shippingSnapshot = order?.shippingSnapshot;
	if (isLoading) return <SpinnerLoading />;
	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between bg-white padding border-radius">
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
			<div className="grid grid-cols-1  lg:grid-cols-3 gap-5">
				<div className="lg:col-span-2 space-y-5">
					<div className=" bg-white padding border-radius space-y-3">
						<div className=" border border-muted border-radius">
							{order?.items?.map((item, index) => {
								const variantDetails =
									item?.variantDetails || "";
								const transformedData =
									variantDetails.split(",");
								return (
									<div
										key={item.id}
										className={cn(
											"flex justify-between items-center gap-x-2 padding",
											{
												"border-b": !(
													index ===
													(order?.items?.length ??
														0) -
														1
												),
											},
										)}
									>
										<div className="flex items-center gap-x-2">
											<img
												src={item.product.images[0].url}
												className="size-16 border-radius"
											/>
											<div>
												<p>{item.productName}</p>
												<ul className="flex items-center gap-x-1.5 list-none text-xs">
													<li className="bg-muted px-1 py-0.5 rounded font-medium">
														${item.priceAtPurchase}
													</li>
													{item.variantDetails &&
														transformedData.map(
															(info, index) => (
																<li
																	key={index}
																	className="bg-muted px-1 py-0.5 rounded"
																>
																	{info}
																</li>
															),
														)}
												</ul>
											</div>
										</div>
										<div>
											<p>
												$
												{Number(item.priceAtPurchase) *
													item.quantity}
											</p>
											<p className="text-sm">
												Qty: {item.quantity}
											</p>
										</div>
									</div>
								);
							})}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 text-gray-500 gap-5">
							<div className="md:col-span-2">
								{order?.notes && (
									<div className="flex gap-x-2">
										<span className="font-medium ">
											Order Note:
										</span>
										<span>{order.notes}</span>
									</div>
								)}
							</div>
							<div>
								<div>
									<RowText
										title="Subtotal"
										value={`$${order?.subtotal}`}
									/>
									<RowText
										title="Shipping"
										value={`$${order?.shippingCost}`}
									/>
									<RowText
										title="Tax"
										value={`$${order?.tax}`}
									/>
								</div>
								<TDSeparator className="my-1.5" />
								<RowText
									title="Total"
									value={`$${order?.totalAmount}`}
									className="text-black"
								/>
							</div>
						</div>
					</div>
					<div className="bg-white padding border-radius">
						<p className="text-xl mb-5">Customer Details</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5">
							<div className="text-gray-500">
								<RowText
									title="Name"
									value={shippingSnapshot?.fullName}
									titleClassName="text-gray-800 font-medium"
								/>
								<RowText
									title="Email"
									value={order?.user.email}
									titleClassName="text-gray-800 font-medium"
								/>
								<RowText
									title="Phone"
									value={shippingSnapshot?.phone}
									titleClassName="text-gray-800 font-medium"
								/>
								<RowText
									title="Address"
									value={shippingSnapshot?.street}
									titleClassName="text-gray-800 font-medium"
								/>
							</div>
							<div className="text-gray-500">
								<RowText
									title="City"
									value={shippingSnapshot?.city}
									titleClassName="text-gray-800 font-medium"
								/>
								<RowText
									title="PostalCode"
									value={shippingSnapshot?.postalCode}
									titleClassName="text-gray-800 font-medium"
								/>
								<RowText
									title="State"
									value={shippingSnapshot?.state}
									titleClassName="text-gray-800 font-medium"
								/>
								<RowText
									title="Country"
									value={shippingSnapshot?.country}
									titleClassName="text-gray-800 font-medium"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="lg:col-span-1">
					<Stepper steps={steps} clickable />
				</div>
			</div>
		</div>
	);
}
