"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { store } from "@/redux/store";
const persistor = persistStore(store);
export default function Providers({ children }: { children: React.ReactNode }) {

    return (
        <Provider store={store}>
            <SessionProvider>
                <PersistGate loading={null} persistor={persistor}>
                    {children}
                </PersistGate>
            </SessionProvider>
        </Provider>
    );
}
