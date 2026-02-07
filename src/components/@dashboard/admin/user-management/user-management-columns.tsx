import { Button } from "@/components/ui/button";
import { DataTableColumn } from "@/types/table.types";
import { TUser } from "@/types/user.types";

export const userManagementColumns: DataTableColumn<TUser>[] = [
    {
        header: "User",
        key: "user",
        cell: (row) => {
            return (
                <div className="flex items-center gap-x-2">
                    <img
                        src={row.avatar || ""}
                        alt="User-1"
                        height={40}
                        width={40}
                        className="size-14 rounded-md overflow-hidden object-center object-cover"
                    />
                    <div className="space-y-1.5">
                        <p className="font-semibold">{row.name}</p>
                        <p className="text-muted-foreground">{row.email}</p>
                    </div>
                </div>
            );
        },
    },
    {
        header: "Role",
        key: "role",
        cell: (row) => {
            return <p className="font-semibold">{row.role}</p>;
        },
    },
    {
        header: "Action",
        key: "action",
        cell: (row) => {
            return (
                <div className="flex items-center gap-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-black"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-black"
                    >
                        Delete
                    </Button>
                </div>
            );
        },
    },
    
];
