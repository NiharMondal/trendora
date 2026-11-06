import { Clock, LucideIcon, RotateCcw, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";

import { TVendorCard } from "@/features/vendors/types/vendor.types";

/**
 * Delivery and returns terms beside the buy box. Shipping is charged per
 * store, so the fee and free-shipping threshold shown are the selling store's
 * own (`product.vendor`), the same values the cart estimate uses.
 */
export default function DeliveryDetails({ vendor }: { vendor?: TVendorCard }) {
    const fee = Number(vendor?.shippingFee);
    const threshold = Number(vendor?.freeShippingThreshold);
    const hasShippingTerms =
        vendor?.shippingFee !== undefined && Number.isFinite(fee);

    return (
        <ul className="divide-y rounded-2xl border bg-card text-sm">
            {hasShippingTerms && (
                <Row icon={Truck} title="Shipping">
                    {fee === 0
                        ? "Free shipping on every order from this store."
                        : threshold > 0
                          ? `$${fee} from this store, free on orders over $${threshold}.`
                          : `$${fee} from this store.`}
                </Row>
            )}
            <Row icon={Clock} title="Delivery time">
                12-26 days (International), 2-6 days (Bangladesh)
            </Row>
            <Row icon={RotateCcw} title="Returns">
                Return within 45 days of purchase. Duties &amp; taxes are
                non-refundable.
            </Row>
            {vendor && (
                <Row icon={Store} title="Sold by">
                    <Link
                        href={`/stores/${vendor.slug}`}
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                        View {vendor.storeName} store information
                    </Link>
                </Row>
            )}
        </ul>
    );
}

function Row({
    icon: Icon,
    title,
    children,
}: {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
}) {
    return (
        <li className="flex gap-3 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="space-y-0.5">
                <p className="font-medium">{title}</p>
                <p className="text-muted-foreground">{children}</p>
            </div>
        </li>
    );
}
