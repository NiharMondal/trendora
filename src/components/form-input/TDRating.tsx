import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";

import { ReactSmartRating } from "react-smart-rating";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";

type TDRatingProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    required?: boolean;
    size?: number;
};

export default function TDRating<T extends FieldValues>({
    form,
    name,
    label,
    required,
    size = 20,
}: TDRatingProps<T>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="-space-y-1">
                    <FormLabel className="text-muted-foreground font-inter text-sm">
                        <span
                            className={cn({
                                "relative required-label": required,
                            })}
                        >
                            {label}
                        </span>
                    </FormLabel>

                    <FormControl>
                        <ReactSmartRating
                            totalStars={5}
                            initialRating={field.value}
                            onChange={field.onChange}
                            step={0.5}
                            size={size}
                        />
                    </FormControl>

                    <div className="min-h-4">
                        <FormMessage className="text-red-500 text-xs" />
                    </div>
                </FormItem>
            )}
        />
    );
}
