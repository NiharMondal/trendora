import TDInput from "@/components/form-input/TDInput";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TDButton from "../../td-button";
import { sizeGroupSchema, TSizeGroupFormValues } from "./size-group-schema";

type Props = {
	defaultValues?: TSizeGroupFormValues | undefined;
	onSubmit: (values: TSizeGroupFormValues) => Promise<void> | void;
	isSubmitting?: boolean;
	onSuccess?: () => void;
};

export default function SizeGroupForm({
	defaultValues,
	onSubmit,
	onSuccess,
	isSubmitting,
}: Props) {
	const hookform = useForm<TSizeGroupFormValues>({
		resolver: zodResolver(sizeGroupSchema),
		defaultValues: defaultValues ?? {
			name: "",
		},
	});

	const handleSizeGroupSubmit = (values: TSizeGroupFormValues) => {
		onSubmit(values);
		onSuccess?.();
	};

	return (
		<Form {...hookform}>
			<form
				onSubmit={hookform.handleSubmit(handleSizeGroupSubmit)}
				className="space-y-1.5 bg-white p-5 rounded-md"
			>
				<TDInput form={hookform} name="name" label="Size Group Name" required />

				<TDButton
					type="submit"
					isLoading={isSubmitting}
					className="px-5"
				>
					{defaultValues ? "Update Size Group" : "Add Size Group"}
				</TDButton>
			</form>
		</Form>
	);
}
