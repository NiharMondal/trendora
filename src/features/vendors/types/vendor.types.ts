import { TMetaData } from "@/shared/types/common.types";

export type TVendorStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

/**
 * The store identity attached to every product and vendor order. This is the
 * subset the backend returns on public/product payloads (`vendorCardSelect`) —
 * enough for a "sold by" line and a link to the storefront.
 */
export type TVendorCard = {
    id: string;
    storeName: string;
    slug: string;
    logo?: string | null;
    averageRating?: string | null;
    status?: TVendorStatus;
    /**
     * The store's delivery terms, as decimal strings. Present on product
     * payloads because the cart charges shipping per store and needs them to
     * estimate a total (see features/cart/utils/calculate-order-total.ts).
     */
    shippingFee?: string;
    freeShippingThreshold?: string;
};

/** A public storefront (`GET /vendors`, `GET /vendors/:slug`). */
export type TVendorPublic = {
    id: string;
    storeName: string;
    slug: string;
    description?: string | null;
    logo?: string | null;
    banner?: string | null;
    averageRating?: string | null;
    totalReviews: number;
    shippingFee?: string;
    freeShippingThreshold?: string;
    createdAt: string;
    /** Only on the single-store read. */
    totalProducts?: number;
};

/**
 * The caller's own store (`GET /vendors/me`) or an admin's view of one. Money
 * fields arrive as decimal strings, like everywhere else in this API.
 */
export type TVendor = {
    id: string;
    ownerId: string;
    storeName: string;
    slug: string;
    description?: string | null;
    logo?: string | null;
    logoPublicId?: string | null;
    banner?: string | null;
    bannerPublicId?: string | null;
    status: TVendorStatus;
    rejectionReason?: string | null;
    approvedAt?: string | null;
    suspendedAt?: string | null;
    businessEmail: string;
    businessPhone: string;
    taxId?: string | null;
    /** Platform's cut as a fraction, e.g. "0.1" = 10%. Admin-controlled. */
    commissionRate: string;
    shippingFee: string;
    freeShippingThreshold: string;
    averageRating?: string | null;
    totalReviews: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    // admin list/detail extras
    owner?: {
        id: string;
        name: string;
        avatar?: string | null;
        auth?: { email: string; role: string } | null;
    };
    _count?: {
        products?: number;
        vendorOrders?: number;
        payouts?: number;
    };
};

/** `GET /vendors/me/dashboard`. */
export type TVendorDashboard = {
    store: {
        id: string;
        storeName: string;
        slug: string;
        status: TVendorStatus;
        averageRating?: string | null;
        totalReviews: number;
        commissionRate: number;
    };
    overview: {
        totalOrders: number;
        grossSales: number;
        netEarnings: number;
        commissionPaid: number;
        averageOrderValue: number;
        pendingPayoutAmount: number;
        pendingPayoutOrders: number;
    };
    ordersByStatus: { status: string; count: number }[];
    productsByStatus: { status: string; count: number }[];
    topProducts: {
        productId: string;
        productName: string;
        quantitySold: number;
        revenue: number;
    }[];
    recentOrders: unknown[];
};

export type TVendorReview = {
    id: string;
    vendorId: string;
    userId: string;
    vendorOrderId: string;
    rating: string;
    comment?: string | null;
    createdAt: string;
    updatedAt: string;
    user?: { name: string; avatar?: string | null };
    vendor?: TVendorCard;
    vendorOrder?: { id: string; vendorOrderNumber: string };
};

export type TVendorListResponse = {
    meta?: TMetaData;
    result: TVendor[];
};
