import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import { TRefund } from "@/features/refunds/types/refund.types";
import { TOrderStatus, TPaymentStatus } from "@/shared/types/status.types";

export type ShippingSnapshot = {
	id: string;
	city: string;
	phone: string;
	state: string;
	street: string;
	userId: string;
	country: string;
	fullName: string;
	createdAt: string;
	isDefault: boolean;
	isDeleted: boolean;
	updatedAt: string;
	postalCode: string;
};

export type TOrderItemResponse = {
	id: string;
	orderId: string;
	/** Which slice of the order this item belongs to. */
	vendorOrderId?: string;
	vendorId?: string;
	productId: string;
	productName: string;
	variantId?: string;
	variantDetails?: string;
	quantity: number;
	priceAtPurchase: string;
	originalPrice: string;
	discount: string;
	subtotal: string;
    product: {
        name: string;
        slug:string;
        images:{
            url:string;
        }[]
    }
};

export type TOrderPaymentResponse = {
	id: string;
	orderId: string;
	amount: string;
	method: string;
	status: string;
	// Nullable columns on the backend's `Payment`, and optional because list
	// reads select only some of them (XR-05).
	transactionId?: string | null;
	paymentGateway?: string | null;
	/**
	 * The raw gateway payload. ADMIN only — `sanitizePayment` strips it for
	 * buyers and sellers — and deliberately `unknown`: narrow before reading.
	 */
	gatewayResponse?: unknown;
	failureReason?: string | null;
	paidAt?: string | null;
	refundedAt?: string | null;
	/** Money that actually went back (Prisma Decimal, so a string). */
	refundAmount?: string | null;
	createdAt: string;
	updatedAt: string;
};
/**
 * The buyer-facing order: one checkout, one payment, one shipping address.
 *
 * Its money fields are the SUM of `vendorOrders`, and `orderStatus` is a
 * DERIVED rollup of their statuses — the real fulfilment state (and the
 * tracking number) lives on each slice, because each store ships separately.
 * Render per-store detail from `vendorOrders`, not from `orderStatus`.
 */
export type TOrder = {
	id: string;
	orderNumber: string;
	userId: string;
	subtotal: string;
	tax: string;
	shippingCost: string;
	discount: string;
	totalAmount: string;
	paymentStatus: TPaymentStatus;
	paymentMethod: string;
	/** Rollup of the vendor order statuses — never the whole picture. */
	orderStatus: TOrderStatus;
	shippingAddressId: string;
	ipAddress: string;
	userAgent: string;
	notes: string;
	shippingSnapshot: ShippingSnapshot;
	/** One per store on the order. */
	vendorOrders?: TVendorOrder[];
	/** Refund ledger for this order — one row per attempt to return money. */
	refunds?: TRefund[];
	/**
	 * Flat item list. Still returned on some reads, but prefer
	 * `vendorOrders[].items` so items stay attached to the store shipping them.
	 */
	items?: TOrderItemResponse[];
    payment?: TOrderPaymentResponse;
	user: {
		id: string;
		name: string;
		/** Flat since backend FE-41; null only for a user with no Auth row. */
		email: string | null;
		avatar: string;
	};
	createdAt: string;
	updatedAt: string;
};


export type TCreateOrderResult = {
	// STRIPE: no order row exists yet — the webhook creates it after the
	// charge — so the response is the payment URL plus the priced breakdown.
	paymentUrl: string | null;
	orderNumber?: string;
	/** Per-store split the backend actually priced. STRIPE branch only. */
	vendors?: {
		vendorId: string;
		storeName: string;
		slug: string;
		subtotal: number;
		tax: number;
		shippingCost: number;
		totalAmount: number;
		itemCount: number;
	}[];
	totalAmount?: number;
	// CASH_ON_DELIVERY: the order exists immediately.
	order?: TOrder;
};

type OrderItemInput = {
	productId: string;
	variantId?: string;
	quantity: number;
};

type NewShippingAddressInput = {
	fullName: string;
	phone: string;
	email:string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
};

export type TCreateOrderPayload =
	| {
			items: OrderItemInput[];
			paymentMethod: string;
			notes?: string;
			shippingAddressId?: string;
	  }
	| {
			items: OrderItemInput[];
			paymentMethod: string;
			notes?: string;
			address: NewShippingAddressInput;
	  };

/**
 * `GET /orders/analytics` (ADMIN).
 *
 * `totalRevenue` is gross merchandise value — what buyers paid in total, most
 * of which is owed to vendors. `platformCommission` is what the platform
 * actually earns; report them separately or the dashboard overstates income.
 */
export type TTopProduct = {
	productId: string;
	/** The name at purchase, so a renamed listing still reads as sold. */
	productName: string;
	quantitySold: number;
	/** Merchandise value of those units, before tax and shipping. */
	revenue: number;
	/** `null` once the listing is deleted. */
	slug: string | null;
	image: string | null;
	storeName: string | null;
	storeSlug: string | null;
};

export type TOrderAnalytics = {
	overview: {
		totalOrders: number;
		totalRevenue: number;
		platformCommission: number;
		vendorEarnings: number;
		averageOrderValue: number;
	};
	ordersByStatus: { status: string; count: number }[];
	vendorsByStatus: { status: string; count: number }[];
	/** Best-selling products by units, cancelled parcels excluded. Top 10. */
	topProducts: TTopProduct[];
	topVendors: {
		vendorId: string;
		storeName: string | null;
		slug: string | null;
		orders: number;
		grossSales: number;
		commission: number;
		vendorEarnings: number;
	}[];
	recentOrders: TOrder[];
};

/**
 * `GET /orders/analytics/sales-trend` — platform sales over time (ADMIN).
 *
 * Zero-filled buckets: one per UTC day for a window of up to 90 days, one per
 * UTC month beyond that. `date` is the bucket's first day (`YYYY-MM-DD`). The
 * money uses the same rules as `TOrderAnalytics.overview`, so the series sums
 * to the headline tiles for the same window.
 */
export type TSalesTrendPoint = {
	date: string;
	orders: number;
	/** GMV — the total of paid orders. */
	grossSales: number;
	/** The platform's cut of paid, non-cancelled parcels. */
	commission: number;
};

export type TSalesTrend = {
	granularity: "day" | "month";
	startDate: string;
	endDate: string;
	points: TSalesTrendPoint[];
};

/**
 * `GET /orders/my-summary` — the shopper dashboard's numbers, for the caller's
 * own purchases (a VENDOR gets what they bought, not what they sold).
 */
export type TBuyerSummary = {
	totalOrders: number;
	/** Completed payments minus money actually refunded. */
	totalSpent: number;
	parcels: { inProgress: number; delivered: number; canceled: number };
	/** Refunds still owed: pending, being sent, or failed. */
	openRefunds: { count: number; amount: number };
	/** Delivered products (still on sale) the buyer has not reviewed — the first three, plus the total. */
	awaitingReview: { count: number; products: { name: string; slug: string }[] };
};
