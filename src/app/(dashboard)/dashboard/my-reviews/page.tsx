import MyReviewsList from "@/components/@dashboard/customer/my-reviews-list/my-reviews-list";

export default function MyReviewsPage() {
    return (
        <div className="space-y-5 bg-white rounded-md padding border-radius">
            <h3>My Reviews</h3>
            <MyReviewsList />
        </div>
    );
}
