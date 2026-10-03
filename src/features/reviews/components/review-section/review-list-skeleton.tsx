export default function ReviewListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="flex animate-pulse gap-4 rounded-lg border border-muted bg-card/50 p-5"
                >
                    <div className="size-11 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/3 rounded bg-muted" />
                        <div className="h-3 w-1/4 rounded bg-muted" />
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="h-3 w-5/6 rounded bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}
