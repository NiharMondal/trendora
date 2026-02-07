import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";

type TDCheckboxProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    description?: string;
    required?: boolean;
    disabled?: boolean;
};

export default function TDCheckbox<T extends FieldValues>({
    form,
    name,
    label,
    description,
    required,
    disabled,
}: TDCheckboxProps<T>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-">
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                                field.onChange(!!checked)
                            }
                            disabled={disabled}
                        />
                    </FormControl>
                    <div className="leading-none space-y-1">
                        <FormLabel>
                            <span
                                className={cn({
                                    "relative required-label": required,
                                })}
                            >
                                {label}
                            </span>
                        </FormLabel>
                        {description && (
                            <FormDescription className="text-muted-foreground text-xs">
                                {description}
                            </FormDescription>
                        )}
                    </div>
                    <div className="min-h-4">
                        <FormMessage className="text-red-500 text-xs" />
                    </div>
                </FormItem>
            )}
        />
    );
}
