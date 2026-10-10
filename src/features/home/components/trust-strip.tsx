import { BadgeCheck, Headphones, RotateCcw, Truck } from "lucide-react";

import Container from "@/shared/components/container";

/**
 * The four objections a first-time buyer has before they will add to cart.
 *
 * Static on purpose: shipping terms are per store on a marketplace, so any
 * figure quoted here would be wrong for some of the catalogue. It says what is
 * true platform-wide and leaves the numbers to the cart, which knows the
 * store.
 */
const PROMISES = [
    {
        icon: Truck,
        title: "Free delivery thresholds",
        detail: "Each store sets its own — shown before you pay.",
    },
    {
        icon: RotateCcw,
        title: "Cancel while pending",
        detail: "Refunded automatically to your original payment method.",
    },
    {
        icon: BadgeCheck,
        title: "Verified sellers only",
        detail: "Every store is reviewed before it can list.",
    },
    {
        icon: Headphones,
        title: "Secure checkout",
        detail: "Card details go straight to Stripe, never to us.",
    },
];

export default function TrustStrip() {
    return (
        <section className="border-y border-muted bg-primary-50/40">
            <Container className="grid grid-cols-2 gap-x-6 gap-y-6 py-8 lg:grid-cols-4">
                {PROMISES.map(({ icon: Icon, title, detail }) => (
                    <div key={title} className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                            <Icon className="size-5" />
                        </span>
                        <div className="space-y-0.5">
                            <p className="text-sm font-semibold">{title}</p>
                            <p className="text-xs text-muted-foreground">
                                {detail}
                            </p>
                        </div>
                    </div>
                ))}
            </Container>
        </section>
    );
}
