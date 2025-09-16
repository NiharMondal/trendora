import Footer from "@/components/common/footer";
import HeroSection from "@/components/home/hero";
import Showcase from "@/components/home/showcase";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main>
			{/* <Navbar /> */}
			<HeroSection />
			<Showcase />
			<Footer />
		</main>
	);
}
