import Headline from "@/components/common/dashboard/headline";
import AddSize from "./add-size";

export default function AddSizePage() {
	return (
		<div className="space-y-5">
			<Headline title="Add Size" showBackButton />
			<AddSize />
		</div>
	);
}
