import TopProducts from "@/components/@dashboard/top-products";
import OrderChart from "@/components/charts/order-chart";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import React from "react";

export default function AdminHomePage() {
	return (
		<div className="space-y-5">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{[...Array(4)].map((item, index) => {
					const colorsList = [
						"#f24312",
						"#c3f98e",
						"#d45f87",
						"#e560f8",
					];
					const randomColor =
						colorsList[
							Math.floor(Math.random() * colorsList.length)
						];
					return (
						<div
							className={cn(
								"rounded-2xl p-5 shadow-md flex gap-x-4 items-center"
							)}
							key={index}
						>
							<div
								className="size-16 polygon  flex items-center justify-center"
								style={{ backgroundColor: randomColor }}
							>
								<ShoppingBag className="text-white" />
							</div>
							<div>
								<p className="font-normal tracking-wider">
									Total Sales
								</p>
								<strong>1234</strong>
							</div>
						</div>
					);
				})}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Recent Orders  */}
				<OrderChart />

				{/* top products  */}
				<TopProducts />
			</div>
		</div>
	);
}
