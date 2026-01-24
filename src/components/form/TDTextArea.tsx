import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

type TDTextAreaProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
};

export default function TDTextArea<T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
    className,
    required,
}: TDTextAreaProps<T>) {
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
                    <FormControl>
                        <Textarea
                            {...field}
                            placeholder={placeholder}
                            className={className}
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
