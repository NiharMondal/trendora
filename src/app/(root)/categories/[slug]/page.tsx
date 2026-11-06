import CategoryRedirect from "@/features/categories/components/category-redirect";
import Container from "@/shared/components/container";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <Container className="py-10">
            <CategoryRedirect slug={slug} />
        </Container>
    );
}
