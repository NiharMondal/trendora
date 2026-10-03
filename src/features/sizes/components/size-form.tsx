
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import TDCombobox from "@/shared/form/TDCombobox";
import TDInput from "@/shared/form/TDInput";
import { Form } from "@/shared/ui/form";
import { useAllSizeGroupsQuery } from "@/features/size-groups/api/size-group.api";

import TDButton from "@/shared/components/td-button";
import { sizeFormSchema, TSizeFormValues } from "@/features/sizes/schemas/size-form.schema";

type Props = {
	defaultValues?: TSizeFormValues | undefined;
	onSubmit: (values: TSizeFormValues) => Promise<void> | void;
	isSubmitting?: boolean;
	onSuccess?: () => void;
};

export default function SizeForm({
	defaultValues,
	onSubmit,
	onSuccess,
	isSubmitting,
}: Props) {
    const {data: sizeGroups} = useAllSizeGroupsQuery({});
	const hookform = useForm<TSizeFormValues>({
		resolver: zodResolver(sizeFormSchema),
		defaultValues: defaultValues ?? {
			name: "",
			sizeGroupId: "",
		},
	});

    const sizeGroupOptions = sizeGroups?.result.map((sg) => ({
        label: sg.name,
        value: sg.id,
    })) || [];

	const handleSizeGroupSubmit = (values: TSizeFormValues) => {
		onSubmit(values);
		onSuccess?.();
	};

	return (
		<Form {...hookform}>
			<form
				onSubmit={hookform.handleSubmit(handleSizeGroupSubmit)}
				className="space-y-1.5 bg-white p-5 rounded-md"
			>
				<TDInput
					form={hookform}
					name="name"
					label="Size Name"
					required
				/>
				<TDCombobox
					form={hookform}
					name="sizeGroupId"
					label="Group ID"
					placeholder="Select a size"
					options={sizeGroupOptions} 
				/>
				<TDButton
					type="submit"
					isLoading={isSubmitting}
					className="px-5"
				>
					{defaultValues ? "Update Size" : "Add Size"}
				</TDButton>
			</form>
		</Form>
	);
}
