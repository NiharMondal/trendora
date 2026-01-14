import React, { useState } from "react";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../ui/command";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

type Option = {
    label: string;
    value: string;
};

type TDComboboxProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    options?: Option[];
    className?: string;
    required?: boolean;
};

export default function TDCombobox<T extends FieldValues>({
    form,
    name,
    label,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    emptyText = "No option found.",
    options = [],
    className,
    required,
}: TDComboboxProps<T>) {
    const [open, setOpen] = useState(false);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel className="text-muted-foreground font-inter text-base">
                        <span
                            className={cn(
                                required ? "relative required-label" : ""
                            )}
                        >
                            {label}
                        </span>
                    </FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn(
                                        "w-full h-12 bg-white hover:bg-white hover:text-muted-foreground text-muted-foreground font-normal",
                                        "justify-between",
                                        !field.value && "text-muted-foreground",
                                        className
                                    )}
                                >
                                    {field.value
                                        ? options.find(
                                              (option) =>
                                                  option.value === field.value
                                          )?.label
                                        : placeholder}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                            <Command>
                                <CommandInput placeholder={searchPlaceholder} />
                                <CommandEmpty>{emptyText}</CommandEmpty>
                                <CommandGroup>
                                    {options.length > 0 ? (
                                        options.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.label}
                                                onSelect={() => {
                                                    field.onChange(
                                                        option.value
                                                    );
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        field.value ===
                                                            option.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))
                                    ) : (
                                        <CommandItem disabled>
                                            No options available
                                        </CommandItem>
                                    )}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    );
}
