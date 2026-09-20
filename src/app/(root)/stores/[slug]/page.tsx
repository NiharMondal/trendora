import StoreFront from "@/features/vendors/components/store-front";

export default async function StorePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return <StoreFront slug={slug} />;
}
