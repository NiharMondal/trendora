"use client";
import AddNewAddress from "@/features/addresses/components/add-new-address";
import AddressList from "@/features/addresses/components/address-list";
import Headline from "@/shared/components/headline";
import TDButton from "@/shared/components/td-button";
import TDSheet from "@/shared/components/td-sheet";
import { useState } from "react";

export default function AddressPage() {
    const [open, setOpen] = useState(false);

    const handleCloseDrawer = () => {
        setOpen(false);
    };

    return (
        <>
            <div className="space-y-5">
                <Headline title="Address" showBackButton>
                    <TDButton onClick={() => setOpen(true)}>
                        New Address
                    </TDButton>
                </Headline>
                <AddressList />
            </div>
            <TDSheet isOpen={open} setIsOpen={setOpen} title="Add New Address">
                <AddNewAddress handleCloseDrawer={handleCloseDrawer} />
            </TDSheet>
        </>
    );
}
