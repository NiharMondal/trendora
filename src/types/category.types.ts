export type TCategory = {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};
