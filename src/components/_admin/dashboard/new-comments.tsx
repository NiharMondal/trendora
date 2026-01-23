"use client";
import TDSeparator from "@/components/common/@ui/td-separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAllReviewQuery } from "@/redux/api/reviewApi";
import { ReactSmartRating } from "react-smart-rating";
export default function NewComments() {
    const { data } = useAllReviewQuery({
        limit: "5",
        sortBy: "createdAt",
        orderBy: "desc",
    });
    console.log(data);
    return (
        <div className="bg-white rounded-2xl shadow-2xl p-5 lg:col-span-2">
            <h4 className="font-semibold text-black">New Comments</h4>
            <TDSeparator />
            {!data?.result?.length && <p>No comments found.</p>}
            <div className="space-y-3">
                {data?.result?.map((review) => (
                    <div
                        className="flex  gap-x-5 border border-muted p-5 rounded-md"
                        key={review?.id}
                    >
                        <Avatar className="size-12 rounded-full overflow-hidden">
                            <AvatarImage
                                src={
                                    review?.user?.avatar ||
                                    "https://github.com/shadcn.png"
                                }
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-y-1.5">
                            <div>
                                <p className="font-medium">
                                    {review?.user?.name}
                                </p>
                                <ReactSmartRating
                                    initialRating={review?.rating}
                                    activeColor="red"
                                    size={16}
                                    readOnly
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {review?.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
