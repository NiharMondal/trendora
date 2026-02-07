"use client";
import TDInput from "@/components/form-input/TDInput";
import TDSelect from "@/components/form-input/TDSelect";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { CategoryUpdateInput } from "@/form-schema/category-schema";
import {
    useAllCategoryQuery,
    useCategoryByIdQuery,
    useUpdateCategoryMutation,
} from "@/redux/api/productCategoryApi";
import { Edit } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateCategory({ id }: { id: string }) {
    const { data: categories } = useAllCategoryQuery({}); // fetching all categories for dropdown
    const { data: category } = useCategoryByIdQuery(id); //fetching category by ID
    const [updateCategory] = useUpdateCategoryMutation(); // update category function

    const categoryOptions = categories?.result.map((cat) => {
        return {
            label: cat.name,
            value: cat.id,
        };
    });

    const form = useForm<CategoryUpdateInput>({
        defaultValues: {
            name: "",
            parentId: "",
        },
    });

    // update category
    const handleUpdate = async (values: CategoryUpdateInput) => {
        try {
            await updateCategory({ payload: values, id }).unwrap();
            toast.success("Category updated successfully");
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };

    // resetting default data to actual data
    useEffect(() => {
        if (category?.result) {
            form.reset({
                name: category?.result?.name,
                parentId: category.result.parentId,
            });
        }
    }, [category?.result]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"}>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="sr-only">
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleUpdate)}
                        className="space-y-5"
                    >
                        <TDInput
                            name="name"
                            label="Name"
                            form={form}
                            required
                        />
                        <TDSelect
                            form={form}
                            name="parentId"
                            label="Parent ID"
                            className="w-full"
                            options={categoryOptions}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
