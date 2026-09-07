import { Star } from "lucide-react";

type ReviewSummaryProps = {
    average: number;
    total: number;
    distribution: { star: number; count: number }[];
};

export default function ReviewSummary({
    average,
    total,
    distribution,
}: ReviewSummaryProps) {
    return (
        <div className="rounded-lg border border-muted bg-card/50 p-6">
            <div className="flex flex-col items-center gap-2 border-b border-muted pb-5">
                <p className="text-5xl font-bold">{average}</p>
                <p className="text-sm text-muted-foreground">
                    Based on {total} {total === 1 ? "review" : "reviews"}
                </p>
            </div>

            <div className="space-y-2 pt-5">
                {distribution.map(({ star, count }) => {
                    const percent = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <div
                            key={star}
                            className="flex items-center gap-3 text-sm"
                        >
                            <span className="w-3 font-medium">{star}</span>
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full bg-yellow-400 transition-all"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <span className="w-8 text-right text-muted-foreground">
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
