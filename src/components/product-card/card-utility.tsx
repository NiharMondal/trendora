import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Eye, Heart } from "lucide-react";

export default function CardUtility() {
	return (
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
					<TooltipTrigger className="bg-neutral-light size-8 rounded-full flex items-center justify-center text-neutral-dark/80">
						<Eye />
					</TooltipTrigger>
					<TooltipContent side="left">
						<p>Quick View</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
