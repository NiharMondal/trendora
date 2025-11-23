import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type Option = {
	label: string;
	value: string;
	id?: string;
};

type TDRadioGroupProps<T extends FieldValues> = {
	form: UseFormReturn<T>;
	name: Path<T>;
	label: string;
	options: Option[];
	required?: boolean;
};

export default function TDRadioGroup<T extends FieldValues>({
	form,
	name,
	label,
	options,
	required,
}: TDRadioGroupProps<T>) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="space-y-3">
					<FormLabel>{label}</FormLabel>

					<FormControl>
						<RadioGroup
							onValueChange={field.onChange}
							defaultValue={field.value}
							className="space-y-2"
						>
							{options.map((option, index) => (
								<div
									key={option.value}
									className="flex items-center gap-3"
								>
									<RadioGroupItem
										value={option.value}
										id={option.id ?? `${name}-${index}`}
									/>
									<Label
										htmlFor={
											option.id ?? `${name}-${index}`
										}
									>
										{option.label}
									</Label>
								</div>
							))}
						</RadioGroup>
					</FormControl>

					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
