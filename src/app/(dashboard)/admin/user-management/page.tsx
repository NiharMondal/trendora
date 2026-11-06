import { Metadata } from "next";

import UserManagementTable from "@/features/users/components/user-management-table";

export const metadata: Metadata = {
    title: "Trendora | User Management",
};

export default function UserManagementPage() {
    return <UserManagementTable />;
}
