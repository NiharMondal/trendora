"use client";
import Container from "@/components/common/container";
import RelatedProducts from "@/components/common/related-product";
import SpinnerLoading from "@/components/common/spinner-loading";
import { cn } from "@/lib/utils";
import { useProductBySlugQuery } from "@/redux/api/productApi";
import Image from "next/image";
import { use, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import ProductDetails from "./product-details";

export default function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const { data, isLoading } = useProductBySlugQuery(slug);
    const product = data?.result;
    const [currentIndex, setCurrentIndex] = useState(0);
    if (isLoading) return <SpinnerLoading />;
    return (
        <Container className="py-10">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Photo section  */}
                <div className="space-y-3">
                    <PhotoProvider
                        onIndexChange={(newIndex) => setCurrentIndex(newIndex)}
                    >
                        {/* ⭐ MAIN IMAGE — click to open fullscreen viewer */}
                        {product?.images.map((item, index) => (
                            <PhotoView src={item.url} key={item.id}>
                                {index < 1 ? (
                                    <Image
                                        height={200}
                                        width={200}
                                        src={product?.images[currentIndex]?.url}
                                        alt="Main"
                                        className="w-full h-[600px] object-cover rounded cursor-crosshair"
                                        onClick={() =>
                                            setCurrentIndex(currentIndex)
                                        }
                                    />
                                ) : undefined}
                            </PhotoView>
                        ))}
                    </PhotoProvider>
                    {/* ⭐ THUMBNAILS */}
                    <div className="grid grid-cols-4 gap-4">
                        {product?.images.map((img, index) => (
                            <Image
                                key={img.id}
                                height={80}
                                width={100}
                                src={img.url}
                                alt="thumb"
                                className={cn(
                                    "h-20 w-full object-cover rounded cursor-pointer",
                                    {
                                        "ring-2 ring-blue-500":
                                            index === currentIndex,
                                    }
                                )}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* details section  */}
                <ProductDetails product={product} />
            </section>
            {/* related products  */}
            <RelatedProducts />
        </Container>
    );
}
