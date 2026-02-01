"use client";
import TDInput from "@/components/form-input/TDInput";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export default function UpdateAddress() {
    const form = useForm();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"ghost"}
                    className="w-full h-14 border border-accent"
                >
                    Add New Address
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full md:min-w-3xl">
                <DialogTitle className="mb-3">Create new Address</DialogTitle>
                <Form {...form}>
                    <form className="space-y-5 ">
                        <TDInput name="fullname" label="Fullname" form={form} />
                        <TDInput name="phone" label="Phone" form={form} />
                        <TDInput name="street" label="Street" form={form} />
                        <TDInput name="city" label="City" form={form} />
                        <TDInput
                            name="state"
                            label="State / Division"
                            form={form}
                        />
                        <TDInput
                            name="postalCode"
                            label="Postal code"
                            form={form}
                        />
                        <TDInput name="country" label="Country" form={form} />

                        <Button> Create New Address</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
