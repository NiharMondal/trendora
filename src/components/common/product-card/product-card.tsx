import { useAppDispatch } from "@/redux/redux.hooks";
import { addItemToCart } from "@/redux/slice/cartSlice";
import { TProduct } from "@/types/product.types";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import CardUtility from "./card-utility";
import ProductPrice from "./product-price";

type Props = {
    product: TProduct;
};

export default function ProductCard({ product }: Props) {
    const dispatch = useAppDispatch();
    const isMainPhoto = product?.images?.find((img) => img?.isMain);
    const productPrice = product?.discountPrice
        ? product?.discountPrice
        : product?.basePrice;
    const handleAddToCart = (product: TProduct | undefined) => {
        const productData = {
            productId: product?.id ?? "",
            productName: product?.name ?? "",
            productImage: product?.images[0].url,
            quantity: 1,
            price: Number(productPrice),
        };
        dispatch(addItemToCart(productData));
        toast.success("Product added to cart");
    };
    return (
        <div className="rounded-md group space-y-2">
            <div className="relative h-[330px] overflow-hidden">
                <CardUtility product={product} />

                <Link href={`/products/${product.slug}`}>
                    {product?.images?.length && (
                        <img
                            src={isMainPhoto?.url || product.images[0].url}
                            alt="image"
                            height={300}
                            width={200}
                            className="w-full h-full object-cover object-center rounded aspect-auto"
                            loading="lazy"
                        />
                    )}
                </Link>

                <div className="absolute -bottom-10 opacity-0 left-0 right-0 group-hover:bottom-2 duration-200 group-hover:opacity-100 px-5">
                    <Button
                        className="w-full cursor-pointer  rounded-full"
                        variant={"outline"}
                        onClick={() => handleAddToCart(product)}
                    >
                        Quick Add
                    </Button>
                </div>
            </div>
            <div className="p-0">
                <Link
                    href={`/products/${product.slug}`}
                    className="text-sm tracking-wide hover:underline font-semibold"
                >
                    {product.name}
                </Link>
                <ProductPrice
                    basePrice={product.basePrice}
                    discountPrice={product.discountPrice}
                />
            </div>
        </div>
    );
}
