import { cn } from "@/lib/utils";
import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

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
    inputSize?: "default" | "sm" | "lg";
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
    inputSize,
}: TDInputProps<T>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="-space-y-1">
                    <FormLabel className="text-muted-foreground font-inter text-base">
                        <span
                            className={cn({
                                "relative required-label": required,
                            })}
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
                                inputSize={inputSize}
                                {...field}
                                {...(type === "number" && {
                                    onChange: (e) =>
                                        field.onChange(e.target.valueAsNumber),
                                })}
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
                    <div className="min-h-4">
                        <FormMessage className="text-red-500 text-xs" />
                    </div>
                </FormItem>
            )}
        />
    );
}
