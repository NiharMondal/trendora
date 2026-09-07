import { TSizeGroup } from "@/features/size-groups/types/size-group.types";

export type TSize = {
	id: string;
	name: string;
	sizeGroupId: string;
	sizeGroup?: TSizeGroup | null;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
};
