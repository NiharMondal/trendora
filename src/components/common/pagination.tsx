import { Button } from "../ui/button";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    limit: number;
    totalData: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({
    currentPage,
    totalPages,
    limit,
    totalData,
    onPageChange,
}: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        // Determine the start and end page
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();
    return (
        <div className="flex items-center justify-between px-2 w-full">
            <p className="max-w-fit text-xs text-muted-foreground tracking-wide">
                Showing {Math.min((currentPage - 1) * limit + 1, totalData)}-
                {Math.min(currentPage * limit, totalData)} of {totalData} items
            </p>

            <div className="flex items-center justify-end gap-x-3">
                {/* Previous Button */}
                <Button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant={"ghost"}
                    className="cursor-pointer"
                >
                    Prev
                </Button>

                <div className="flex items-center gap-x-3">
                    {pageNumbers.map((page) => (
                        <Button
                            key={page}
                            onClick={() => onPageChange(page)}
                            variant={
                                page === currentPage ? "default" : "outline"
                            }
                            className="gap-x-5 cursor-pointer"
                        >
                            {page}
                        </Button>
                    ))}
                </div>

                {/* Next Button */}
                <Button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant={"ghost"}
                    className="cursor-pointer"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
