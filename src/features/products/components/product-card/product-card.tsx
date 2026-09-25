"use client";

import { ImageOff, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { TProduct } from "@/features/products/types/product.types";
import { useAppDispatch } from "@/store/redux.hooks";
import { addItemToCart } from "@/features/cart/store/cart.slice";
import { toCartItem } from "@/features/cart/utils/to-cart-item";
import { cn } from "@/shared/lib/utils";

import StoreBadge from "@/features/vendors/components/store-badge";
import { QuickViewButton, WishlistButton } from "./card-utility";
import ProductPrice from "./product-price";
import Image from "next/image";

type Props = {
	product: TProduct;
};

const IMAGE_SIZES = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw";

export default function ProductCard({ product }: Props) {
	const dispatch = useAppDispatch();
	const [imageFailed, setImageFailed] = useState(false);

	const images = (product?.images ?? []).filter((img) => !img.isDeleted);
	const mainImage = images.find((img) => img.isMain) ?? images[0];
	// A second photo, when there is one, is shown on hover.
	const hoverImage = images.find((img) => img.id !== mainImage?.id);

	const href = `/products/${product.slug}`;
	const isSoldOut = product.stockQuantity <= 0;
	const discountPercent = getDiscountPercent(
		product.basePrice,
		product.discountPrice,
	);
	const rating = Number(product.averageRating ?? 0);

	const handleAddToCart = () => {
		dispatch(addItemToCart(toCartItem(product)));
		toast.success("Product added to cart");
	};

	return (
		<article className="group flex h-full flex-col gap-3">
			<div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
				<Link href={href} aria-label={product.name} className="block size-full">
					{/* A row can carry a URL that no longer resolves — an image
					    saved while still in Cloudinary's temp/ folder gets
					    deleted out from under the product (see the backend's
					    BE-41). Without this fallback one such row renders a
					    broken frame in the middle of a home page rail. */}
					{mainImage && !imageFailed ? (
						<>
							<Image
								src={mainImage.url}
								alt={mainImage.altText || product.name}
								fill
								sizes={IMAGE_SIZES}
								className={cn(
									"object-cover object-center transition duration-500 group-hover:scale-105",
									{ "group-hover:opacity-0": hoverImage },
								)}
								onError={() => setImageFailed(true)}
							/>
							{hoverImage && (
								<Image
									src={hoverImage.url}
									alt=""
									fill
									sizes={IMAGE_SIZES}
									className="object-cover object-center opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
								/>
							)}
						</>
					) : (
						<div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
							<ImageOff className="size-8" strokeWidth={1.5} />
							<span className="text-xs">No image</span>
						</div>
					)}
				</Link>

				{/* Badges */}
				<div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
					{isSoldOut ? (
						<span className="rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-background">
							Sold out
						</span>
					) : (
						discountPercent > 0 && (
							<span className="rounded-full bg-destructive-500 px-2.5 py-1 text-[11px] font-semibold text-white">
								-{discountPercent}%
							</span>
						)
					)}
				</div>

				{/* Top-right actions */}
				<div className="absolute right-3 top-3 flex flex-col gap-2">
					<WishlistButton product={product} />
					<QuickViewButton
						product={product}
						className="lg:translate-x-12 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100 lg:focus-visible:translate-x-0 lg:focus-visible:opacity-100"
					/>
				</div>

				{/* Add to cart — always shown on touch, revealed on hover/focus on desktop */}
				<div className="absolute inset-x-3 bottom-3 transition duration-300 lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100">
					<button
						type="button"
						onClick={handleAddToCart}
						disabled={isSoldOut}
						aria-label={`Add ${product.name} to cart`}
						className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white/95 text-sm font-medium text-foreground shadow-md backdrop-blur transition hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-white/95 disabled:hover:text-foreground"
					>
						<ShoppingBag className="size-4" aria-hidden="true" />
						{isSoldOut ? "Sold out" : "Quick add"}
					</button>
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-1.5 px-0.5">
				{product.brand?.name && (
					<p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
						{product.brand.name}
					</p>
				)}
				<Link
					href={href}
					className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-primary-600"
				>
					{product.name}
				</Link>

				{rating > 0 && (
					<p className="flex items-center gap-1 text-xs text-muted-foreground">
						<Star
							className="size-3.5 fill-warning-500 text-warning-500"
							aria-hidden="true"
						/>
						<span className="font-medium text-foreground">
							{rating.toFixed(1)}
						</span>
						{!!product.totalReviews && (
							<span>({product.totalReviews})</span>
						)}
						<span className="sr-only">out of 5 stars</span>
					</p>
				)}

				<ProductPrice
					basePrice={product.basePrice}
					discountPrice={product.discountPrice}
				/>
				<StoreBadge vendor={product.vendor} className="mt-auto pt-1" />
			</div>
		</article>
	);
}

function getDiscountPercent(basePrice: string, discountPrice: string | null) {
	const base = Number(basePrice);
	const discounted = Number(discountPrice);
	if (!discountPrice || !(base > 0) || !(discounted < base)) return 0;
	return Math.round((1 - discounted / base) * 100);
}
