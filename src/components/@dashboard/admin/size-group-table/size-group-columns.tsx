import { Button } from "@/components/ui/button";
import TDPopover from "@/shared/td-popover";
import { TCategory } from "@/types/category.types";
import { TSizeGroup } from "@/types/size-group.types";
import { DataTableColumn } from "@/types/table.types";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import moment from "moment";

type Props = {
	handleEdit: (sizeGroup: TSizeGroup) => void;
	handleDelete: (sizeGroup: TSizeGroup) => void;
};
export const sizeGroupColumns = ({
	handleEdit,
	handleDelete,
}: Props): DataTableColumn<TSizeGroup>[] => [
	{
		key: "name",
		header: "Size Group Name",
	},

	{
		key: "createdAt",
		header: "Created At",
		cell: (row) => {
			const category = row;
			return <span>{moment(category.createdAt).format("LL")}</span>;
		},
	},
	{
		key: "updatedAt",
		header: "Updated At",
		cell: (row) => {
			const category = row;
			return <span>{moment(category.updatedAt).format("LL")}</span>;
		},
	},
	{
		key: "actions",
		header: "Actions",
		cell: (row) => {
			const sizeGroup = row;
			return (
				<TDPopover
					trigger={
						<Button variant="ghost" size="icon">
							<EllipsisVertical />
						</Button>
					}
					className="max-w-[150px]"
				>
					<div className="flex flex-col gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleEdit(sizeGroup)}
						>
							<Edit />
							Edit
						</Button>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => handleDelete(sizeGroup)}
						>
							<Trash />
							Delete
						</Button>
					</div>
				</TDPopover>
			);
		},
	},
];
