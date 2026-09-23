import Image from "next/image";
import Link from "next/link";

import { image } from "@/shared/constants/images";
import { Button } from "@/shared/ui/button";

/**
 * The mid-page break between product rails.
 *
 * Its job is to stop three carousels reading as one undifferentiated scroll,
 * so it is deliberately full-bleed and image-led. The CTA points at the same
 * filtered catalogue the Deals rail previews — the button used to be inert.
 */
export default function PromoBanner() {
    return (
        <section className="relative h-[300px] md:h-[420px]">
            <Image
                src={image.offerBackground}
                alt=""
                aria-hidden
                fill
                priority={false}
                sizes="100vw"
                className="object-cover object-top"
            />

            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-0 flex items-center justify-center px-6">
                <div className="max-w-xl space-y-4 text-center text-white">
                    <h2 className="text-3xl font-semibold md:text-4xl">
                        Markdowns across every store
                    </h2>
                    <p className="text-white/80">
                        One cart, many sellers — and each one&apos;s free
                        delivery threshold is worked out for you at checkout.
                    </p>
                    {/* `Button asChild`, not TDButton — TDButton adds the
                        loading spinner but not Radix's Slot, so it cannot wrap
                        a Link without nesting a button inside an anchor. */}
                    <Button asChild size="lg" className="uppercase">
                        <Link href="/products?onSale=true">Shop the deals</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
