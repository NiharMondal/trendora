import { Button } from "@/components/ui/button";
import TDPopover from "@/shared/td-popover";
import { TSize } from "@/types/size.types";
import { DataTableColumn } from "@/types/table.types";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import moment from "moment";

type Props = {
	handleEdit: (size: TSize) => void;
	handleDelete: (size: TSize) => void;
};
export const sizeColumns = ({
	handleEdit,
	handleDelete,
}: Props): DataTableColumn<TSize>[] => [
	{
		key: "name",
		header: "Size Name",
	},
	{
		key: "sizeGroupId",
		header: "Size Group Name",
		cell: (row) => {
			const sizeGroup = row.sizeGroup;
			return <span>{sizeGroup?.name}</span>;
		},
	},
	{
		key: "createdAt",
		header: "Created At",
		cell: (row) => {
			const category = row;
			return <span>{moment(category.createdAt).format("ll")}</span>;
		},
	},
	{
		key: "updatedAt",
		header: "Updated At",
		cell: (row) => {
			const category = row;
			return <span>{moment(category.updatedAt).format("ll")}</span>;
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
