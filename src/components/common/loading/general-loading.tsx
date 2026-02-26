"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface GeneralLoadingProps {
    title?: string;
    description?: string;
    className?: string;
}

export default function GeneralLoading({
    title,
    description,
    className,
}: GeneralLoadingProps) {
    return (
        <div
            className={cn(
                "flex min-h-[400px] w-full flex-col items-center justify-center gap-6 p-8",
                className,
            )}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-4"
            >
                {/* Main loading visual */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/10 duration-1000" />
                    <Skeleton className="h-24 w-24 rounded-full" />
                </div>

                {/* Content skeletons */}
                <div className="flex flex-col items-center gap-2 text-center">
                    {title ? (
                        <h3 className="text-xl font-semibold tracking-tight text-foreground/80">
                            {title}
                        </h3>
                    ) : (
                        <Skeleton className="h-7 w-48 rounded-lg" />
                    )}

                    {description ? (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <Skeleton className="h-4 w-64 rounded-md" />
                            <Skeleton className="h-4 w-52 rounded-md" />
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
