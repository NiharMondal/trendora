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
	productId: string;
	productName: string;
	variantId: any;
	variantDetails: any;
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
export type TOrder = {
	id: string;
	orderNumber: string;
	userId: string;
	subtotal: string;
	tax: string;
	shippingCost: string;
	discount: string;
	totalAmount: string;
	paymentStatus: string;
	paymentMethod: string;
	orderStatus: string;
	shippingAddressId: string;
	ipAddress: string;
	userAgent: string;
	notes: string;
	shippingSnapshot: ShippingSnapshot;
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
