import Headline from "@/shared/components/headline";

import AddSize from "@/features/sizes/components/add-size";

export default function AddSizePage() {
    return (
        <div className="space-y-5">
            <Headline title="Add Size" showBackButton />
            <AddSize />
        </div>
    );
}
