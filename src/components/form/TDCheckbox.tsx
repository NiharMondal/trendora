import React from "react";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormDescription,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

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
				<FormItem className="flex flex-row items-center space-x-3 space-y-0">
					<FormControl>
						<Checkbox
							checked={field.value}
							onCheckedChange={(checked) =>
								field.onChange(!!checked)
							}
							disabled={disabled}
						/>
					</FormControl>
					<div className="leading-none">
						<FormLabel>
							<span
								className={cn(
									"text-sm font-medium",
									required ? "relative required-label" : ""
								)}
							>
								{label}
							</span>
						</FormLabel>
						{description && (
							<FormDescription className="text-gray-shade-35">
								{description}
							</FormDescription>
						)}
						<FormMessage className="text-red-500" />
					</div>
				</FormItem>
			)}
		/>
	);
}
