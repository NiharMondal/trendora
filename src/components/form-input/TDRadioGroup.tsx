import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type Primitive = string | number | boolean;

type Option<T extends Primitive> = {
    label: string;
    value: T;
    id?: string;
};

type ValueType = "string" | "number" | "boolean";

type TDRadioGroupProps<
    TFieldValues extends FieldValues,
    TValue extends Primitive,
> = {
    form: UseFormReturn<TFieldValues>;
    name: Path<TFieldValues>;
    label: string;
    options: Option<TValue>[];
    required?: boolean;
    valueType: ValueType;
};

export default function TDRadioGroup<
    TFieldValues extends FieldValues,
    TValue extends Primitive,
>({
    form,
    name,
    label,
    options,
    required,
    valueType,
}: TDRadioGroupProps<TFieldValues, TValue>) {
    const toStringValue = (val: TValue | undefined) => {
        if (val === undefined || val === null) return undefined;
        return String(val);
    };
    const fromStringValue = (val: string): TValue => {
        switch (valueType) {
            case "boolean":
                return (val === "true") as TValue;
            case "number":
                return Number(val) as TValue;
            default:
                return val as TValue;
        }
    };

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3">
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
                        <RadioGroup
                            value={toStringValue(field.value)}
                            onValueChange={(val) =>
                                field.onChange(fromStringValue(val))
                            }
                            className="space-y-2"
                        >
                            {options.map((option, index) => {
                                const id = option.id ?? `${name}-${index}`;
                                return (
                                    <div
                                        key={id}
                                        className="flex items-center gap-3"
                                    >
                                        <RadioGroupItem
                                            value={String(option.value)}
                                            id={id}
                                        />
                                        <Label
                                            htmlFor={id}
                                            className="text-muted-foreground "
                                        >
                                            {option.label}
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </FormControl>

                    <div className="min-h-4">
                        <FormMessage className="text-red-500 text-xs" />
                    </div>
                </FormItem>
            )}
        />
    );
}
