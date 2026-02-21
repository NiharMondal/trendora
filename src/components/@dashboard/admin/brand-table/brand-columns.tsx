import { Button } from "@/components/ui/button";
import TDPopover from "@/shared/td-popover";
import { TBrand } from "@/types/brand.types";
import { DataTableColumn } from "@/types/table.types";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import moment from "moment";

type Props = {
	handleEdit: (category: TBrand) => void;
	handleDelete: (category: TBrand) => void;
};
export const brandColumns = ({
	handleEdit,
	handleDelete,
}: Props): DataTableColumn<TBrand>[] => [
	{
		key: "name",
		header: "Brand Name",
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
			const category = row;
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
							onClick={() => handleEdit(category)}
						>
							<Edit />
							Edit
						</Button>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => handleDelete(category)}
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
