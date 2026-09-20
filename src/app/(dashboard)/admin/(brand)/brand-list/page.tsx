import BrandTable from "@/features/brands/components/brand-table";
import Headline from "@/shared/components/headline";

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
