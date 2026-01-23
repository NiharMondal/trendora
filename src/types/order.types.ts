import { TUser } from "./user.types";

export type TOrder = {
    id: string;
    userId: string;
    totalAmount: string;
    paymentStatus: string;
    paymentMethod: string;
    orderStatus: string;
    shippingAddressId: string;
    createdAt: string;
    updatedAt: string;
    user: Pick<TUser, "name" | "avatar" | "email">;
};
