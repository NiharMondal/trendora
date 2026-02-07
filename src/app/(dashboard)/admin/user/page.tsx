"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, Trash } from "lucide-react";
import { useState } from "react";

import TableLoadingSkeleton from "@/components/common/table-loading-skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { productsImage } from "@/helping-data/image";
import { useAllUserQuery } from "@/redux/api/userApi";
import Image from "next/image";

import Pagination from "@/components/common/pagination";
import NoDataFound from "@/shared/no-data-found";
import { useDebounce } from "use-debounce";

export default function UserPage() {
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState("10");
    const [currentPage, setCurrentPage] = useState(1);

    const [value] = useDebounce(search, 1000);
    const { data: users, isLoading } = useAllUserQuery({
        search: value,
        limit: limit,
        page: currentPage.toString(),
    });

    if (isLoading) return <TableLoadingSkeleton />;

    if (!users?.result.length) {
        return <NoDataFound />;
    }
    return (
        <div className="space-y-4">
            <h4>User List</h4>
            <div className="bg-white p-8 rounded-2xl shadow-md space-y-5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex gap-x-4 items-center">
                        <p>Showing</p>
                        <Select onValueChange={(value) => setLimit(value)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Limit">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="30">30</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Input
                        placeholder="Search here..."
                        className="max-w-lg"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.result.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="flex items-center gap-x-2">
                                    <Image
                                        src={user.avatar || productsImage.red}
                                        alt="User-1"
                                        height={40}
                                        width={40}
                                        className="size-14 rounded-md overflow-hidden object-center object-cover"
                                    />
                                    <div className="space-y-1.5">
                                        <p className="font-semibold">
                                            {user.name}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Dhaka, Bangladesh
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone ?? "Null"}</TableCell>
                                <TableCell>{user.role}</TableCell>

                                <TableCell className="text-right space-x-2">
                                    <Button variant={"secondary"}>
                                        <Eye />
                                    </Button>

                                    <Button variant={"destructive"}>
                                        <Trash />
                                        Block
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {users?.meta && (
                    <div className="flex items-center justify-between mt-10">
                        <p className="max-w-fit text-xs text-muted-foreground tracking-wide">
                            Showing {limit} items
                        </p>
                        <Pagination
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            totalPages={users.meta.totalPages}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
