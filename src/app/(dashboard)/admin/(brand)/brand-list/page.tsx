import BrandTable from "@/components/@dashboard/admin/brand-table/brand-table";
import Headline from "@/components/common/dashboard/headline";

export default function BrandListPage() {
	return (
		<div className="space-y-5">
			<Headline
				title="Brand List"
				showBackButton
				href="/admin/add-brand"
				buttonText="Add Brand"
			/>
			<BrandTable />
		</div>
	);
}
