import React from "react";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

type TDTextAreaProps<T extends FieldValues> = {
	form: UseFormReturn<T>;
	name: Path<T>;
	label: string;
	placeholder?: string;
	rows?: number;
	required?: boolean;
};

export default function TDTextArea<T extends FieldValues>({
	form,
	name,
	label,
	placeholder,
	rows = 5,
	required,
}: TDTextAreaProps<T>) {
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
						<Textarea
							{...field}
							placeholder={placeholder}
							rows={rows}
						/>
					</FormControl>
					<FormMessage className="text-red-500" />
				</FormItem>
			)}
		/>
	);
}
