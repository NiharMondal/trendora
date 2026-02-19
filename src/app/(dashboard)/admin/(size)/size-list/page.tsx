import SizeTable from "@/components/@dashboard/admin/size-table/size-table";
import Headline from "@/components/common/dashboard/headline";

export default function SizeListPage() {
	return (
		<div className="space-y-5">
			<Headline
				title="Size List"
				href="/admin/add-size"
				showBackButton
				buttonText="Add Size"
			/>
			<SizeTable />
		</div>
	);
}
