"use client";
import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";

let persistor = persistStore(store);
export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					{children}
				</PersistGate>
			</Provider>
		</SessionProvider>
	);
}
