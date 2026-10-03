"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import TDButton from "@/shared/components/td-button";
import { Form } from "@/shared/ui/form";
import { useCreateOrderMutation } from "@/features/orders/api/order.api";
import { useAppDispatch, useAppSelector } from "@/store/redux.hooks";
import { clearCart, selectCartItems } from "@/features/cart/store/cart.slice";
import {
    calculateOrderTotals,
    currencyFormatter,
} from "@/features/cart/utils/calculate-order-total";

import TDRadioGroup from "@/shared/form/TDRadioGroup";
import { useRouter } from "next/navigation";
import BillingInformation from "./billing-information";
import {
    checkoutFormSchema,
    TCheckoutFormValues,
} from "@/features/checkout/schemas/checkout-form.schema";
import { paymentMethodOptions } from "@/features/checkout/constants/payment-method-options";

export default function CheckoutForm() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const cartItems = useAppSelector(selectCartItems);
    // Grouped by store: each store ships separately and charges its own
    // shipping, so the review step is laid out the same way.
    const { vendors, subtotal, tax, shippingCost, totalAmount } =
        calculateOrderTotals(cartItems);
    const form = useForm<TCheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            shippingAddressId: "",
            paymentMethod: "",
            notes: "",
        },
    });
    const handleCreateOrder = async (values: TCheckoutFormValues) => {
        const payload = {
            items: cartItems.map((item) => ({
                productId: item.productId,
                variantId: item?.variantId || undefined,
                quantity: item.quantity,
            })),
            paymentMethod: values.paymentMethod,
            notes: values.notes,
            ...(values.shippingAddressId
                ? { shippingAddressId: values.shippingAddressId }
                : {
                      address: {
                          fullName: values.fullName,
                          email: values.email,
                          phone: values.phone,
                          street: values.street,
                          city: values.city,
                          state: values.state,
                          postalCode: values.postalCode,
                          country: values.country,
                      },
                  }),
        };
        try {
            const res = await createOrder(payload).unwrap();

            // Stripe: the order is only created by the webhook after the charge,
            // so hand the browser over to Checkout and let /payment-success (or
            // /payment-cancel) take it from there — including clearing the cart.
            if (res.result?.paymentUrl) {
                window.location.href = res.result.paymentUrl;
                return;
            }

            toast.success("Order placed successfully");
            dispatch(clearCart());
            router.push("/");
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };

    return (
        <Form {...form}>
            <form
                className="grid grid-cols-1 lg:grid-cols-2 gap-5"
                onSubmit={form.handleSubmit(handleCreateOrder)}
            >
                <div className="bg-white rounded-md p-5 space-y-7 lg:col-span-1">
                    <p className="text-lg font-medium pb-2 border-b">
                        Shipping Information
                    </p>
                    <BillingInformation />
                </div>
                <div className="bg-white rounded-md p-5 space-y-5">
                    <div className="space-y-7">
                        <p className="text-lg font-medium pb-2 border-b">
                            Payment Method
                        </p>
                        <TDRadioGroup
                            name="paymentMethod"
                            label="Select a payment method"
                            form={form}
                            options={paymentMethodOptions}
                            valueType="string"
                            required
                        />
                    </div>
                    <div className="space-y-7">
                        <p className="text-lg font-medium pb-2 border-b">
                            Order Overview
                        </p>

                        {vendors.length > 1 && (
                            <p className="text-xs text-muted-foreground -mt-4">
                                {vendors.length} stores — each ships separately
                                and you can track each parcel on its own.
                            </p>
                        )}

                        <div className="space-y-5">
                            {vendors.map((group) => (
                                <div
                                    key={group.vendorId}
                                    className="border border-muted rounded-md overflow-hidden"
                                >
                                    <div className="flex items-center justify-between bg-gray-50 px-3 py-2">
                                        <p className="text-sm font-medium">
                                            {group.storeName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {group.shippingCost === 0
                                                ? "Free shipping"
                                                : `+ ${currencyFormatter(group.shippingCost)} shipping`}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3 p-3">
                                        {group.items.map((item) => (
                                            <div
                                                key={`${item.productId}-${item.variantId}`}
                                                className="flex items-center gap-3 border border-muted rounded-md p-3"
                                            >
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="size-16 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {item.productName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} x $
                                                        {item.price}{" "}
                                                        {item?.variantId && (
                                                            <span className="bg-success/10 text-success rounded-full px-1 py-0.5 text-[8px] ">
                                                                Variant
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="divide-y border rounded-md text-sm">
                            <SummaryLine
                                label="Subtotal"
                                value={currencyFormatter(subtotal)}
                            />
                            <SummaryLine
                                label="Tax"
                                value={currencyFormatter(tax)}
                            />
                            <SummaryLine
                                label={
                                    vendors.length > 1
                                        ? `Shipping (${vendors.length} stores)`
                                        : "Shipping"
                                }
                                value={
                                    shippingCost === 0
                                        ? "Free"
                                        : currencyFormatter(shippingCost)
                                }
                            />
                            <SummaryLine
                                label="Total"
                                value={currencyFormatter(totalAmount)}
                                bold
                            />
                        </div>

                        <TDButton
                            type="submit"
                            className="w-full font-bold"
                            isLoading={isLoading}
                        >
                            Place Order
                        </TDButton>
                    </div>
                </div>
            </form>
        </Form>
    );
}

function SummaryLine({
    label,
    value,
    bold,
}: {
    label: string;
    value: string;
    bold?: boolean;
}) {
    return (
        <div className="flex items-center justify-between px-3 py-2.5">
            <span className={bold ? "font-bold" : "text-gray-600"}>
                {label}
            </span>
            <span className={bold ? "font-bold" : "font-medium"}>{value}</span>
        </div>
    );
}
