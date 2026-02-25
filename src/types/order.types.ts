

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
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string;
    }
	createdAt: string;
	updatedAt: string;
};
export type ShippingSnapshot = {
     id: string
  city: string
  phone: string
  state: string
  street: string
  userId: string
  country: string
  fullName: string
  createdAt: string
  isDefault: boolean
  isDeleted: boolean
  updatedAt: string
  postalCode: string
}