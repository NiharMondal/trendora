import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type SortByOption = {
    label: string;
    value: string;
};
type TableToolbarProps = {
    search?: string;
    searchPlaceholder?: string;
    limit?: string;
    sortBy?: string;
    setLimit?: (value: string) => void;
    setSortBy?: (value: string) => void;
    setSearch?: (value: string) => void;
    sortByOptions?: SortByOption[];
};

export default function TableToolbar({
    search,
    setSearch,
    searchPlaceholder = "Search here...",
    limit,
    setLimit,
    sortBy,
    setSortBy,
    sortByOptions = [
        { label: "Asc", value: "createdAt:asc" },
        { label: "Desc", value: "createdAt:desc" },
    ],
}: TableToolbarProps) {
    return (
        <div className="flex items-center justify-between flex-wrap gap-3 w-full bg-white border border-muted p-3 rounded-md">
            {setSearch && (
                <Input
                    placeholder={searchPlaceholder}
                    className="flex-1 md:max-w-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    inputSize="sm"
                />
            )}

            <div className="flex items-center gap-x-3">
                {setSortBy && (
                    <div className="flex gap-x-2 items-center">
                        <p className="text-sm text-muted-foreground whitespace-nowrap">
                            Sort By
                        </p>
                        <Select
                            value={sortBy}
                            onValueChange={(value) => setSortBy(value)}
                        >
                            <SelectTrigger className="w-[120px]" size="sm">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortByOptions?.map((option: SortByOption) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {setLimit && (
                    <div className="flex gap-x-2 items-center">
                        <p className="text-sm text-muted-foreground whitespace-nowrap">
                            Showing
                        </p>
                        <Select
                            value={limit?.toString()}
                            onValueChange={(value) => setLimit(value)}
                        >
                            <SelectTrigger className="w-[86px]" size="sm">
                                <SelectValue placeholder="Limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="30">30</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
        </div>
    );
}
