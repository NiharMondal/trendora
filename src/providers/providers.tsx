"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { store } from "@/store/store";
import AuthSync from "@/components/providers/auth-sync";
const persistor = persistStore(store);
export default function Providers({ children }: { children: React.ReactNode }) {

    return (
        <Provider store={store}>
            <SessionProvider >
                <AuthSync>
                    <PersistGate loading={null} persistor={persistor}>
                        {children}
                    </PersistGate>
                </AuthSync>
            </SessionProvider>
        </Provider>
    );
}
