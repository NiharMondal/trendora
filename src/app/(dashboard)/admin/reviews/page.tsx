import ReviewTable from "./review-table";

export default function Reviews() {
    return (
        <div className="space-y-5">
            <div className="bg-white rounded-md p-5">
                <h4 className="font-medium text-black">Review List</h4>
            </div>
            <ReviewTable />
        </div>
    );
}
