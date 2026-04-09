"use client";
import { store } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";
import AuthSync from "./auth-sync";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [persistor, setPersistor] = useState<any>(null);

    useEffect(() => {
        setPersistor(persistStore(store));
    }, []);

    if (!persistor) return <>{children}</>;

    return (
        <SessionProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AuthSync>{children}</AuthSync>
                </PersistGate>
            </Provider>
        </SessionProvider>
    );
}
