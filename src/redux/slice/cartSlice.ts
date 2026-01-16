import { TCartProduct } from "@/types/cart.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialStateType = {
    cartItems: TCartProduct[];
};

const initialState: InitialStateType = {
    cartItems: [],
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },

        addItemToCart: (state, action: PayloadAction<TCartProduct>) => {
            const { productId, variantId, quantity = 1 } = action.payload;
            const existingItem = state.cartItems.find(
                (item) =>
                    item.productId === productId && item.variantId === variantId
            );
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cartItems.push({
                    ...action.payload,
                    quantity,
                });
            }
        },

        removeCartItem: (
            state,
            action: PayloadAction<{
                productId: string;
                variantId?: string | null;
            }>
        ) => {
            state.cartItems = state.cartItems.filter(
                (item) =>
                    !(
                        item.productId === action.payload.productId &&
                        item.variantId === action.payload.variantId
                    )
            );
        },

        increaseQuantity: (
            state,
            action: PayloadAction<{
                productId: string;
                variantId?: string | null;
            }>
        ) => {
            const item = state.cartItems.find(
                (pd) =>
                    pd.productId === action.payload.productId &&
                    pd.variantId === action.payload.variantId
            );

            if (item) {
                item.quantity += 1;
            }
        },

        decreaseQuantity: (
            state,
            action: PayloadAction<{
                productId: string;
                variantId?: string | null;
            }>
        ) => {
            const itemIndex = state.cartItems.findIndex(
                (pd) =>
                    pd.productId === action.payload.productId &&
                    pd.variantId === action.payload.variantId
            );

            if (itemIndex === -1) return;

            if (state.cartItems[itemIndex].quantity > 1) {
                state.cartItems[itemIndex].quantity -= 1;
            } else {
                state.cartItems.splice(itemIndex, 1);
            }
        },
    },
});

export const {
    addItemToCart,
    removeCartItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.cartItems;

export const selectCartQuantity = (state: RootState) =>
    state.cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalAmount = (state: RootState) =>
    state.cart.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

export default cartSlice.reducer;
