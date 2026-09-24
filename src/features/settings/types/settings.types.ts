import type { TVendorStatus } from "@/shared/types/status.types";

/** `GET /settings` — the backend's environment configuration, read-only. */
export type TPlatformSettings = {
    pricing: {
        /** Used for any category without its own `taxRate`. */
        taxRate: number;
        /** Stamped onto a store when it is created; each store keeps its own after. */
        newStoreDefaults: {
            commissionRate: number;
            shippingFee: number;
            freeShippingThreshold: number;
        };
    };
    checkout: { checkoutSessionTtlMinutes: number };
    /** On/off only — the backend never returns a secret. */
    features: {
        stripePayments: boolean;
        stripeWebhook: boolean;
        cloudinary: boolean;
        email: boolean;
        scheduler: boolean;
    };
    overrides: {
        categoryTaxRates: { id: string; name: string; taxRate: number }[];
        /** Stores whose terms differ from `newStoreDefaults`. */
        storeTerms: {
            id: string;
            storeName: string;
            status: TVendorStatus;
            commissionRate: number;
            shippingFee: number;
            freeShippingThreshold: number;
        }[];
        totalStores: number;
    };
};
