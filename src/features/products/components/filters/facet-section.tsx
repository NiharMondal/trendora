"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Checkbox } from "@/shared/ui/checkbox";

export type TFacetOption = {
    value: string;
    label: string;
    count: number;
    /** Optional heading this option sits under, e.g. its size group. */
    group?: string | null;
    /** Nests the row under the one above it, for a child category. */
    indent?: boolean;
};

type FacetSectionProps = {
    title: string;
    options: TFacetOption[];
    isSelected: (value: string) => boolean;
    onToggle: (value: string) => void;
    /** Options shown before "Show all"; the rest collapse behind it. */
    visibleCount?: number;
    defaultOpen?: boolean;
};

/**
 * One collapsible block of the filter panel: a list of checkboxes with the
 * number of products each one would leave.
 *
 * Every option here came from the server's facet response, so ticking one can
 * never produce an empty page — and because those counts are computed with
 * this dimension's own selection dropped, siblings keep their counts and stay
 * tickable after the first choice. A zero would mean the two sides disagree,
 * so options are rendered exactly as received.
 */
export default function FacetSection({
    title,
    options,
    isSelected,
    onToggle,
    visibleCount = 6,
    defaultOpen = true,
}: FacetSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [showAll, setShowAll] = useState(false);

    if (options.length === 0) return null;

    // A collapsed section must never hide a filter that is currently applied,
    // or the shopper sees a narrowed grid with no visible reason for it.
    const hasHiddenSelection = options
        .slice(visibleCount)
        .some((option) => isSelected(option.value));

    const isExpanded = showAll || hasHiddenSelection;
    const visible = isExpanded ? options : options.slice(0, visibleCount);

    return (
        <div className="border-b border-muted pb-4">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between py-2 text-sm font-semibold cursor-pointer"
            >
                {title}
                <ChevronDown
                    className={cn(
                        "size-4 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180",
                    )}
                />
            </button>

            {isOpen && (
                <ul className="space-y-1.5 pt-1">
                    {visible.map((option, index) => {
                        const checkboxId = `facet-${title}-${option.value}`;
                        const isNewGroup =
                            option.group &&
                            option.group !== visible[index - 1]?.group;

                        return (
                            <li key={option.value}>
                                {isNewGroup && (
                                    <p className="pt-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        {option.group}
                                    </p>
                                )}

                                <label
                                    htmlFor={checkboxId}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
                                        option.indent && "pl-4",
                                    )}
                                >
                                    <Checkbox
                                        id={checkboxId}
                                        checked={isSelected(option.value)}
                                        onCheckedChange={() =>
                                            onToggle(option.value)
                                        }
                                    />
                                    <span className="flex-1 truncate">
                                        {option.label}
                                    </span>
                                    <span className="text-xs tabular-nums text-muted-foreground/70">
                                        {option.count}
                                    </span>
                                </label>
                            </li>
                        );
                    })}

                    {options.length > visibleCount && !hasHiddenSelection && (
                        <li>
                            <button
                                type="button"
                                onClick={() => setShowAll((all) => !all)}
                                className="pt-1 text-xs font-medium text-primary hover:underline cursor-pointer"
                            >
                                {showAll
                                    ? "Show less"
                                    : `Show all ${options.length}`}
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}
