import React from "react";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "../ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

type Option = {
	label: string;
	value: string;
};

type TDSelectProps<T extends FieldValues> = {
	form: UseFormReturn<T>;
	name: Path<T>;
	label: string;
	placeholder?: string;
	options?: Option[];
	className?: string;
	required?: boolean;
};

export default function TDSelect<T extends FieldValues>({
	form,
	name,
	label,
	placeholder = "Select an option",
	options = [],
	className,
	required,
}: TDSelectProps<T>) {
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
						<Select
							value={field.value}
							onValueChange={field.onChange}
						>
							<SelectTrigger className={cn(className)}>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
							<SelectContent>
								{options.length > 0 ? (
									options.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))
								) : (
									<SelectItem value="a" disabled>
										No options available
									</SelectItem>
								)}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage className="text-red-500" />
				</FormItem>
			)}
		/>
	);
}
