import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { SetStateAction } from "react";

type TSortingProps = {
    setSearch: React.Dispatch<SetStateAction<string>>;
    setLimit: React.Dispatch<SetStateAction<string>>;
};
export default function Sorting({ setSearch, setLimit }: TSortingProps) {
    return (
        <div className="flex items-center justify-between flex-wrap gap-3">
            <Input
                placeholder="Search here..."
                className="w-1/2 max-w-lg"
                onChange={(e) => setSearch(e.target.value)}
                inputSize="sm"
            />

            <div className="flex gap-x-2 items-center ">
                <p className="text-sm text-muted-foreground">Showing</p>
                <Select onValueChange={(value) => setLimit(value)}>
                    <SelectTrigger className="w-[120px]" size="sm">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
