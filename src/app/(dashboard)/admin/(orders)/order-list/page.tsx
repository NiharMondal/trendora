import OrderTable from "@/components/@dashboard/admin/order-table/order-table";
import Headline from "@/shared/components/headline";

export default function OrderList() {
	return (
		<div className="space-y-5">
			<Headline
				title="Order List"
				showBackButton

			/>
			<OrderTable />
		</div>
	);
}
