"use client";
import AddNewAddress from "@/components/@dashboard/customer/address/add-new-address";
import AddressList from "@/components/@dashboard/customer/address/address-list";
import Headline from "@/components/common/dashboard/headline";
import TDButton from "@/components/common/shared/td-button";
import TDSheet from "@/components/common/shared/td-sheet";
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
