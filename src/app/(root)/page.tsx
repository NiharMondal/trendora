import { HeroSlider } from "@/features/home/components/hero-slider";
import BrandStrip from "@/features/home/components/brand-strip";
import CategoryTiles from "@/features/home/components/category-tiles";
import PromoBanner from "@/features/home/components/promo-banner";
import TopStores from "@/features/home/components/top-stores";
import TrustStrip from "@/features/home/components/trust-strip";
import {
    BestSellersRail,
    DealsRail,
    FeaturedRail,
    NewArrivalsRail,
    RecentlyViewedRail,
    TopRatedRail,
} from "@/features/home/components/rails";

/**
 * The storefront landing page.
 *
 * The ordering is the point, not the section count. Four product rails stacked
 * together read as one long scroll and the lower ones never get seen, so they
 * are broken up: tiles, then a rail, then a full-bleed banner, then rails
 * again, closing on the sellers — the one section a single-vendor shop could
 * not have.
 *
 * Every section fetches its own data and **renders nothing when it has none**,
 * so this composition is stable on a marketplace at any stage: with no
 * completed orders there are no best sellers, and with no markdowns there are
 * no deals. Neither leaves a heading over an empty shelf.
 */
export default function Home() {
    return (
        // The <main> landmark is in (root)/layout.tsx; a second one here is invalid.
        <div>
            <HeroSlider />
            <TrustStrip />
            {/* Curated picks lead; the tiles keep them off the Deals shelf. */}
            <FeaturedRail />
            <CategoryTiles />
            <DealsRail />
            <PromoBanner />
            <BestSellersRail />
            <NewArrivalsRail />
            <TopRatedRail />
            <BrandStrip />
            {/* Between two non-rail sections, so it never stacks on a shelf. */}
            <RecentlyViewedRail />
            <TopStores />
        </div>
    );
}
