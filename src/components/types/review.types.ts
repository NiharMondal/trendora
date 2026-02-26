import { TUser } from "./user.types";

export type TReview = {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    productId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    user: Pick<TUser, "name" | "avatar">;
};
