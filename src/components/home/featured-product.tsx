import Container from "../common/shared/container";
import SectionHeader from "../common/shared/section-header";

export default function FeaturedProduct() {
    return (
        <div className="py-10">
            <Container className="space-y-10">
                <SectionHeader title="Featured on Trendora" />

                <div className="grid grid-cols-2 md:grid-cols-3  gap-8"></div>
            </Container>
        </div>
    );
}
