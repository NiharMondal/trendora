import Headline from "@/components/common/dashboard/headline";
import AddBrand from "./add-brand";

export default function AddBrandPage() {
	return (
		<div className="space-y-5">
			<Headline title="Add Brand" showBackButton />
			<AddBrand />
		</div>
	);
}
