"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import TDButton from "./td-button";
import { Button } from "../ui/button";
type TDDrawerProps = {
    isDrawerOpen: boolean;
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

export default function TDDrawer({
    isDrawerOpen,
    setIsDrawerOpen,
}: TDDrawerProps) {
    return (
        <>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                    <Button>Open me</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>
                            This action cannot be undone.
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <TDButton>Submit</TDButton>
                        <DrawerClose asChild>
                            <TDButton variant="outline">Cancel</TDButton>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
