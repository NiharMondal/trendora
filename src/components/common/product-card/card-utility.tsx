import { TProduct } from "@/types/product.types";
import { Eye, Heart } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import ProductCommonDetails from "../@ui/product-common-details";
import TDSheet from "../td-sheet";

type Props = {
    product: TProduct;
};
export default function CardUtility({ product }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className="absolute right-0 top-0 overflow-hidden">
                <div className="flex flex-col gap-y-2 pr-3 pt-3 translate-x-12 group-hover:translate-x-0 duration-300 ">
                    <Tooltip>
                        <TooltipTrigger className="bg-neutral-light size-8 rounded-full flex items-center justify-center text-neutral-dark/80">
                            <Heart />
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Add to Wishlist</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger
                            className="bg-neutral-light size-8 rounded-full flex items-center justify-center text-neutral-dark/80"
                            onClick={() => setIsOpen(true)}
                        >
                            <Eye />
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Quick View</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
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
                        <img
                            src={img.url}
                            alt={product.name}
                            className="h-full w-full object-cover rounded-md object-center"
                            key={img.id}
                            loading="lazy"
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
