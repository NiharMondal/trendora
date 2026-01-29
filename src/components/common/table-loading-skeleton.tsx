export default function TableLoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
        </div>
    );
}
