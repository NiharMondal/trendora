import { TSize } from "@/features/sizes/types/size.types";

export type TCategory = {
	id: string;
	name: string;
	slug: string;
	sizeGroupId: string | null;
	parentId: string | null;
	parent?: TCategory | null;
	/** Merchandising artwork for the storefront's category tiles. */
	image: string | null;
	imagePublicId: string | null;
	sizeGroup?: {
		id: string;
		name: string;
		sizes: TSize[];
	};
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
};
