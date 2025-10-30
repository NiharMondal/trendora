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
};

export default function TDInput<T extends FieldValues>({
	form,
	name,
	label,
	placeholder,
	description,
	type = "text",
	disabled,
	required,
}: TDInputProps<T>) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>
						<span
							className={cn(
								required ? "relative required-label" : ""
							)}
						>
							{label}
						</span>
					</FormLabel>
					<FormControl>
						<Input
							type={type}
							placeholder={placeholder}
							disabled={disabled}
							{...field}
						/>
					</FormControl>
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
