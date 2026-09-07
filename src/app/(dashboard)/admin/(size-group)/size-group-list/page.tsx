import SizeGroupTable from "@/features/size-groups/components/size-group-table";
import Headline from "@/shared/components/headline";

export default function SizeGroupList() {
	return (
		<div className="space-y-4">
			<Headline
				title="Size Group List"
				showBackButton
				href="/admin/add-size-group"
				buttonText="Add Size Group"
			/>
			<SizeGroupTable />
		</div>
	);
}
