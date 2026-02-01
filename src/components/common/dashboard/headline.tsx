"use client";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type THeadlineProps = {
    title: string;
    className?: string;
    showBackButton?: boolean;
    href?: string;
    buttonText?: string;
};
export default function Headline({
    title,
    className,
    showBackButton = false,
    href,
    buttonText,
}: THeadlineProps) {
    const router = useRouter();
    const handleBack = () => {
        router.back();
    };
    return (
        <div
            className={cn(
                "bg-white p-5 rounded-md border border-muted flex items-center gap-x-5 justify-between",
                className,
            )}
        >
            <div className="flex items-center gap-x-5">
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
            <div>
                {href && buttonText && (
                    <Link href={href}>
                        <Button>{buttonText}</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
