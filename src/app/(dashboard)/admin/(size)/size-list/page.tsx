import SizeTable from "@/features/sizes/components/size-table";
import Headline from "@/shared/components/headline";

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
