import Footer from "@/components/common/footer";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main>
			<Navbar />
			<div>
				<Button>Click me</Button>
			</div>
			<Footer />
		</main>
	);
}
