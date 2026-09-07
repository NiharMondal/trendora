import Headline from "@/shared/components/headline";

import AddSizeGroup from "@/features/size-groups/components/add-size-group";

export default function AddSizeGroupPage() {
    return (
        <div className="space-y-5">
            <Headline title="Add new Size Group" showBackButton />
            <AddSizeGroup />
        </div>
    );
}
