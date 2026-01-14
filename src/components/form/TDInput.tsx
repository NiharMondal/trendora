import React from "react";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

type TDInputProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
    description?: string;
    disabled?: boolean;
    required?: boolean;
    ornament?: React.ReactElement;
};

export default function TDInput<T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
    description,
    type = "text",
    disabled,
    ornament,
    required,
}: TDInputProps<T>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="-space-y-1">
                    <FormLabel className="text-muted-foreground font-inter text-base">
                        <span
                            className={cn(
                                required ? "relative required-label" : ""
                            )}
                        >
                            {label}
                        </span>
                    </FormLabel>
                    <div className="relative">
                        <FormControl>
                            <Input
                                type={type}
                                placeholder={placeholder}
                                disabled={disabled}
                                {...field}
                            />
                        </FormControl>
                        {ornament && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                                {ornament}
                            </div>
                        )}
                    </div>
                    {description && (
                        <FormDescription className="text-gray-shade-35">
                            {description}
                        </FormDescription>
                    )}
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    );
}
