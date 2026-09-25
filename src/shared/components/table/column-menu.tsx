"use client";

import { Columns3, RotateCcw } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { TColumnOption } from "@/shared/hooks/use-column-visibility";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type Props = {
    options: TColumnOption[];
    onToggle: (key: string) => void;
    onReset: () => void;
    /** The viewer's choice differs from the table's defaults. */
    isCustomised: boolean;
};

/**
 * The toolbar's "Columns" menu. Sized and coloured like the filter pills
 * beside it, and lit the same way when it differs from the default.
 * Columns marked `hideable: false` are listed but locked, so the viewer can
 * see why they cannot be removed.
 */
export default function ColumnMenu({
    options,
    onToggle,
    onReset,
    isCustomised,
}: Props) {
    const shown = options.filter((option) => option.visible).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    aria-label={`Columns, ${shown} of ${options.length} shown`}
                    className={cn(
                        // Explicit hover text — see the "Filters" toggle.
                        "h-9 gap-1.5 rounded-lg border-input bg-white px-2.5 font-medium shadow-xs hover:bg-gray-50 hover:text-foreground",
                        isCustomised &&
                            "border-primary-300 bg-primary-50/50 text-primary-700 hover:bg-primary-50 hover:text-primary-700",
                    )}
                >
                    <Columns3
                        className={cn(
                            "size-3.5",
                            isCustomised
                                ? "text-primary-600"
                                : "text-muted-foreground",
                        )}
                    />
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                        Columns
                    </span>
                    <span className="tabular-nums text-primary-700">
                        {shown}/{options.length}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Show columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {options.map((option) => (
                    <DropdownMenuCheckboxItem
                        key={option.key}
                        checked={option.visible}
                        disabled={!option.hideable}
                        // Keep the menu open so several columns can be toggled.
                        onSelect={(event) => event.preventDefault()}
                        onCheckedChange={() => onToggle(option.key)}
                    >
                        {option.label}
                        {!option.hideable && (
                            <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
                                Always
                            </span>
                        )}
                    </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={!isCustomised}
                    onSelect={onReset}
                    className="text-sm"
                >
                    <RotateCcw />
                    Reset to default
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
