"use client";

import { cn } from "@/lib/utils";
import { FileBox, SearchX } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

interface NoDataFoundProps {
    title?: string;
    description?: string;
    className?: string;
    icon?: React.ElementType;
    actionLabel?: string;
    onAction?: () => void;
}

export default function NoDataFound({
    title = "No Data Found",
    description = "It seems we couldn't find what you were looking for. Try adjusting your filters or search terms.",
    className,
    icon: Icon = SearchX,
    actionLabel,
    onAction,
}: NoDataFoundProps) {
    return (
        <div
            className={cn(
                "flex min-h-[400px] w-full flex-col items-center justify-center rounded-xl border border-muted bg-card/50 p-8 text-center animate-in fade-in zoom-in-95 duration-500",
                className,
            )}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                }}
                className="relative mb-6"
            >
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
                    <Icon
                        className="h-10 w-10 text-primary"
                        strokeWidth={1.5}
                    />

                    {/* Decorative elements */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute inset-0 rounded-full border border-dashed border-primary/30"
                    />
                </div>

                {/* Floating particles suggestion */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="absolute -right-2 top-0 text-muted-foreground/30"
                >
                    <FileBox className="h-6 w-6 -rotate-12" />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="max-w-md space-y-2"
            >
                <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground sm:text-base">
                    {description}
                </p>

                {actionLabel && onAction && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="pt-6"
                    >
                        <button
                            onClick={onAction}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            {actionLabel}
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
