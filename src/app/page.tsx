import Footer from "@/components/common/footer";
import HeroSection from "@/components/home/hero";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main>
			<Navbar />
			<HeroSection />
			<Footer />
		</main>
	);
}
