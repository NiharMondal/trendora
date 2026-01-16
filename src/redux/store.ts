import { configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";

const authConfig = {
    key: "auth",
    version: 1,
    storage,
};
const cartConfig = {
    key: "cart",
    version: 1,
    storage,
};

const authPersistedReducer = persistReducer(authConfig, authReducer);
const cartPersistedReducer = persistReducer(cartConfig, cartReducer);

export const store = configureStore({
    reducer: {
        auth: authPersistedReducer,
        cart: cartPersistedReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
