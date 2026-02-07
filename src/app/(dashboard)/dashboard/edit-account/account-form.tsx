"use client";
import TDInput from "@/components/form-input/TDInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useForm } from "react-hook-form";
export default function AccountForm() {
    const form = useForm();
    return (
        <Form {...form}>
            <form className="space-y-5 bg-white p-10 rounded-2xl shadow col-span-full lg:col-span-2">
                <TDInput form={form} name="name" label="Full Name" />
                <TDInput form={form} name="phone" label="Contact Number" />
                <TDInput
                    form={form}
                    name="avatar"
                    label="Photo URL"
                    placeholder="https://unsplash.com/328*421.jpg"
                />
                <Button size={"lg"} type="submit">
                    Update Information
                </Button>
            </form>
        </Form>
    );
}
