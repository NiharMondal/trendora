import { TSizeGroup } from "./size-group.types";

export type TSize = {
	id: string;
	name: string;
	sizeGroupId: string;
	sizeGroup?: TSizeGroup | null;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
};
