"use client"
import { Eye, Heart } from "lucide-react";
import { useState } from "react";

import { TProduct } from "@/features/products/types/product.types";
import { useWishlistToggle } from "@/features/wishlist/hooks/use-wishlist-toggle";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import ProductCommonDetails from "@/features/products/components/product-common-details";
import TDSheet from "@/shared/components/td-sheet";
import Image from "next/image";

type Props = {
	product: TProduct;
};

const iconButton =
	"cursor-pointer rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur hover:bg-white hover:text-foreground hover:scale-105 disabled:opacity-60";

/** Always visible — a touch device has no hover to reveal it. */
export function WishlistButton({ product }: Props) {
	const { isWishlisted, toggle, isLoading } = useWishlistToggle(product.id);
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			onClick={toggle}
			disabled={isLoading}
			aria-pressed={isWishlisted}
			aria-label={
				isWishlisted
					? `Remove ${product.name} from wishlist`
					: `Add ${product.name} to wishlist`
			}
			className={iconButton}
		>
			<Heart
				className={cn("size-4", {
					"fill-secondary text-secondary": isWishlisted,
				})}
			/>
		</Button>
	);
}

export function QuickViewButton({ product, className }: Props & { className?: string }) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				onClick={() => setIsOpen(true)}
				aria-label={`Quick view ${product.name}`}
				className={cn(iconButton, className)}
			>
				<Eye className="size-4" />
			</Button>
			<TDSheet
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				title="Quick View"
				className="md:min-w-4xl"
			>
				<QuickViewDetails product={product} />
			</TDSheet>
		</>
	);
}

const QuickViewDetails = ({ product }: Props) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-5 overflow-hidden">
			{/** image section */}
			<div className="quick-view-image-scroll">
				<div className="lg:grid-cols-1 flex flex-row lg:flex-col  items-center justify-between gap-5 h-[300px] lg:h-[850px]">
					{product.images?.map((img) => (
						<Image
							src={img.url}
							alt={product.name}
							className="h-full lg:h-[200px] w-full object-cover rounded-md object-center"
							key={img.id}
							loading="lazy"
							width={200}
							height={300}
						/>
					))}
				</div>
			</div>

			{/** details section */}
			<div className="space-y-5 lg:col-span-2">
				<ProductCommonDetails product={product} quickView={true} />
			</div>
		</div>
	);
};
