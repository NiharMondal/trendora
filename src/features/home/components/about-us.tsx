import { Layers, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";

import TrustStrip from "@/features/home/components/trust-strip";
import Container from "@/shared/components/container";
import { Button } from "@/shared/ui/button";

/**
 * Describes how the marketplace actually works — every line here is behaviour
 * the checkout, order and vendor flows implement. No invented figures: the
 * live counts belong to `/stores` and `/products`, which read them from the API.
 */
const HOW_IT_WORKS = [
    {
        icon: Store,
        title: "Many independent stores",
        detail: "Every product on Trendora is listed by a seller, and every store is reviewed by our team before it can sell.",
    },
    {
        icon: ShoppingBag,
        title: "One cart, one checkout",
        detail: "Shop across as many stores as you like and pay once. Each store ships its own parcel, on its own delivery terms, shown before you pay.",
    },
    {
        icon: Layers,
        title: "Each parcel tracked separately",
        detail: "Follow every store's parcel on its own. A parcel can be cancelled while its store has not started on it, and a card payment is refunded automatically.",
    },
];

export default function AboutUs() {
    return (
        <div className="space-y-16 pb-16">
            <section className="bg-primary-50/40">
                <Container className="space-y-5 py-16 text-center">
                    <h1 className="text-3xl font-bold sm:text-4xl">
                        About Trendora
                    </h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground sm:text-lg">
                        Trendora is a marketplace for fashion and footwear. It
                        brings independent stores together in one place, so you
                        can browse all of them and check out once.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button asChild>
                            <Link href="/products">Browse products</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/stores">Meet the stores</Link>
                        </Button>
                    </div>
                </Container>
            </section>

            <Container className="space-y-8">
                <h2 className="text-center text-2xl font-semibold">
                    How it works
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {HOW_IT_WORKS.map(({ icon: Icon, title, detail }) => (
                        <div
                            key={title}
                            className="space-y-3 rounded-xl border border-muted bg-white p-6"
                        >
                            <span className="flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary">
                                <Icon className="size-5" />
                            </span>
                            <h3 className="text-lg font-semibold">{title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {detail}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>

            <TrustStrip />

            <Container>
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground">
                    <h2 className="text-2xl font-semibold">Sell on Trendora</h2>
                    <p className="max-w-xl text-primary-foreground/80">
                        Open a store, set your own shipping fee and
                        free-delivery threshold, and reach shoppers across the
                        whole marketplace. Applications are reviewed before a
                        store goes live.
                    </p>
                    <Button variant="secondary" asChild>
                        <Link href="/vendor/apply">Apply to sell</Link>
                    </Button>
                </div>
            </Container>
        </div>
    );
}
