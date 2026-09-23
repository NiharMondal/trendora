"use client";

import { ImageOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { TProduct } from "@/features/products/types/product.types";
import { useAppDispatch } from "@/store/redux.hooks";
import { addItemToCart } from "@/features/cart/store/cart.slice";
import { toCartItem } from "@/features/cart/utils/to-cart-item";

import { Button } from "@/shared/ui/button";
import StoreBadge from "@/features/vendors/components/store-badge";
import CardUtility from "./card-utility";
import ProductPrice from "./product-price";
import Image from "next/image";

type Props = {
	product: TProduct;
};

export default function ProductCard({ product }: Props) {
	const dispatch = useAppDispatch();
	const [imageFailed, setImageFailed] = useState(false);

	const isMainPhoto = product?.images?.find((img) => img?.isMain);
	const imageUrl = isMainPhoto?.url || product?.images?.[0]?.url;
	const handleAddToCart = (product: TProduct | undefined) => {
		dispatch(addItemToCart(toCartItem(product)));
		toast.success("Product added to cart");
	};
	return (
		<div className="rounded-md group space-y-2">
			<div className="relative h-[330px] overflow-hidden">
				<CardUtility product={product} />

				<Link href={`/products/${product.slug}`}>
					{/* A row can carry a URL that no longer resolves — an image
					    saved while still in Cloudinary's temp/ folder gets
					    deleted out from under the product (see the backend's
					    BE-41). Without this fallback one such row renders a
					    broken frame in the middle of a home page rail. */}
					{imageUrl && !imageFailed ? (
						<Image
							src={imageUrl}
							alt={product.name}
							height={300}
							width={200}
							className="w-full h-full object-cover object-center rounded aspect-auto"
							loading="lazy"
							onError={() => setImageFailed(true)}
						/>
					) : (
						<div className="flex size-full flex-col items-center justify-center gap-2 rounded bg-muted text-muted-foreground">
							<ImageOff className="size-8" strokeWidth={1.5} />
							<span className="text-xs">No image</span>
						</div>
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
				<StoreBadge vendor={product.vendor} />
			</div>
		</div>
	);
}
