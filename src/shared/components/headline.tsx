"use client";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { Tooltip, TooltipContent } from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";

type THeadlineProps = {
    title: string;
    className?: string;
    showBackButton?: boolean;
    href?: string;
    buttonText?: string;
    /** Shown right beside the title, e.g. a status badge. */
    titleExtra?: React.ReactNode;
    /** Right-hand side: actions or page-level details. */
    children?: React.ReactNode;
};
export default function Headline({
    title,
    className,
    showBackButton = false,
    href,
    buttonText,
    titleExtra,
    children,
}: THeadlineProps) {
    const router = useRouter();
    const handleBack = () => {
        router.back();
    };
    return (
        <div
            className={cn(
                "bg-white p-5 rounded-md border border-muted flex flex-wrap items-center gap-x-5 gap-y-3 justify-between",
                className,
            )}
        >
            <div className="flex items-center gap-x-5">
                {showBackButton && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={handleBack}
                                aria-label="Go back"
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
                {titleExtra}
            </div>
            {href && buttonText && (
                <Button asChild>
                    <Link href={href}>{buttonText}</Link>
                </Button>
            )}
            {children}
        </div>
    );
}
