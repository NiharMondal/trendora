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
};

export default function TDSelect<T extends FieldValues>({
	form,
	name,
	label,
	placeholder = "Select an option",
	options = [],
}: TDSelectProps<T>) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Select
							value={field.value}
							onValueChange={field.onChange}
						>
							<SelectTrigger>
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
