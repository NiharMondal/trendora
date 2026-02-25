import { Button } from "@/components/ui/button";

type PaginationProps = {
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	onPageChange: (page: number) => void;
};

export default function Pagination({
	currentPage,
	totalPages,
	hasNextPage,
	hasPreviousPage,
	onPageChange,
}: PaginationProps) {
	const getPageNumbers = () => {
		const pages = [];
		const start = Math.max(1, currentPage - 2);
		const end = Math.min(totalPages, currentPage + 2);
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return pages;
	};

	return (
		<div className="flex items-center justify-end gap-x-3">
			<Button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={!hasPreviousPage}
				variant="ghost"
				className="cursor-pointer"
			>
				Prev
			</Button>

			<div className="flex items-center gap-x-3">
				{getPageNumbers().map((page) => (
					<Button
						key={page}
						onClick={() => onPageChange(page)}
						variant={page === currentPage ? "default" : "outline"}
						className="cursor-pointer"
					>
						{page}
					</Button>
				))}
			</div>

			<Button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={!hasNextPage}
				variant="ghost"
				className="cursor-pointer"
			>
				Next
			</Button>
		</div>
	);
}
