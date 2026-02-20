import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

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
    size?: "sm" | "default" | "lg";
};

export default function TDSelect<T extends FieldValues>({
    form,
    name,
    label,
    placeholder = "Select an option",
    options = [],
    className,
    required,
    size,
}: TDSelectProps<T>) {
    return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="-space-y-1">
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
						<Select
							value={field.value}
							onValueChange={field.onChange}
						>
							<SelectTrigger
								className={cn(className)}
								size={size}
							>
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
										No option available
									</SelectItem>
								)}
							</SelectContent>
						</Select>
					</FormControl>
					<div className="min-h-4">
						<FormMessage className="text-red-500 text-xs" />
					</div>
				</FormItem>
			)}
		/>
	);
}
