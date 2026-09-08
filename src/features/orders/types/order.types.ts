import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import { TOrderStatus, TPaymentStatus } from "@/features/orders/types/status.types";

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
	transactionId: any;
	paymentGateway: any;
	gatewayResponse: any;
	failureReason: any;
	paidAt: any;
	refundedAt: any;
	refundAmount: any;
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
	/**
	 * Flat item list. Still returned on some reads, but prefer
	 * `vendorOrders[].items` so items stay attached to the store shipping them.
	 */
	items?: TOrderItemResponse[];
    payment?: TOrderPaymentResponse;
	user: {
		id: string;
		name: string;
		email: string;
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
	topProducts: {
		productId: string;
		productName: string;
		quantitySold: number;
	}[];
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
