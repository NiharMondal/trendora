"use client";
import { Stepper } from "@/components/ui/stepper";
import { useOrderByIdQuery } from "@/redux/api/orderApi";
const steps = [
    {id:"1", title:"First"},
    {id:"2", title:"Second"},
    {id:"3", title:"Third"},
]
export default function OrderDetails({ slug }: { slug: string }) {

    const {data:orderData, isLoading} = useOrderByIdQuery(slug);
    const order = orderData?.result;
	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between pb-2 border-b border-muted">
				<h3>Order Details</h3>
				<p className="flex items-center gap-x-2">
					Order ID:
					<span className="text-sm font-medium">
						#{order?.orderNumber}
					</span>
				</p>
			</div>

            <div className="grid grid-cols-5">
                <div className="lg:col-span-2">
                    Left
                </div>
                <div className="lg:col-span-3">
                    <Stepper steps={steps} clickable />
                </div>
            </div>
		</div>
	);
}
