import FeaturedProduct from "@/components/home/featured-product";
import { Hero } from "@/components/home/hero";
import NewArrivals from "@/components/home/new-arrivals";
import OfferSection from "@/components/home/offer";
import Showcase from "@/components/home/showcase";
import TrendingProduct from "@/components/home/trending-product";

export default function Home() {
	return (
		<main>
			<Hero />
			<Showcase />
			<NewArrivals />
			<OfferSection />
			<TrendingProduct />
			<FeaturedProduct />
		</main>
	);
}
