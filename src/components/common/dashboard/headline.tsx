"use client";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type THeadlineProps = {
    title: string;
    className?: string;
    showBackButton?: boolean;
};
export default function Headline({
    title,
    className,
    showBackButton = false,
}: THeadlineProps) {
    const router = useRouter();
    const handleBack = () => {
        router.back();
    };
    return (
        <div
            className={cn(
                "bg-white p-5 rounded-md border border-muted flex items-center gap-x-5",
                className,
            )}
        >
            {showBackButton && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleBack}
                            variant={"outline"}
                            className="hover:bg-transparent group"
                        >
                            <ArrowBigLeft className="group-hover:text-muted-foreground duration-150" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Go Back</p>
                    </TooltipContent>
                </Tooltip>
            )}

            <h4>{title}</h4>
        </div>
    );
}
