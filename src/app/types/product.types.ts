export type TProduct = {
	id: string;
	name: string;
	slug: string;
	description: string;
	basePrice: string;
	discountPrice: string | null;
	stockQuantity: number;
	isPublished: boolean;
	isFeatured: boolean;
	categoryId: string;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
};
