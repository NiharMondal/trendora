import TDInput from "@/components/form-input/TDInput";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TDButton from "../../td-button";
import { brandSchema, TBrandFormValues } from "./brand-form-schema";

type Props = {
	defaultValues?: TBrandFormValues | undefined;
	onSubmit: (values: TBrandFormValues) => Promise<void> | void;
	isSubmitting?: boolean;
	onSuccess?: () => void;
};
export default function BrandForm({
	defaultValues,
	onSubmit,
	onSuccess,
	isSubmitting,
}: Props) {
	const hookForm = useForm<TBrandFormValues>({
		resolver: zodResolver(brandSchema),
		defaultValues: defaultValues ?? {
			name: "",
			logo: "",
		},
	});

	const handleBrandSubmit = (values: TBrandFormValues) => {
		onSubmit(values);
		onSuccess?.();
		hookForm.reset();
	};
	return (
		<Form {...hookForm}>
			<form
				onSubmit={hookForm.handleSubmit(handleBrandSubmit)}
				className="space-y-1.5 bg-white p-5 rounded-md"
			>
				<TDInput
					form={hookForm}
					name="name"
					label="Brand name"
					required
				/>
				<TDButton type="submit" disabled={isSubmitting}>
					{defaultValues ? "Update Brand" : "Create Brand"}
				</TDButton>
			</form>
		</Form>
	);
}
