"use client";

import { Edit, Trash } from "lucide-react";

import SpinnerLoading from "@/components/common/loading/spinner-loading";
import TDButton from "@/components/common/shared/td-button";
import TDSheet from "@/components/common/shared/td-sheet";
import { TAddress } from "@/components/types/address.types";
import {
    useDeleteAddressMutation,
    useMyAddressQuery,
} from "@/redux/api/addressApi";
import { useState } from "react";
import { toast } from "sonner";
import EditAddress from "./edit-address";

export default function AddressList() {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<TAddress | null>(
        null,
    );
    const [deleteAddress] = useDeleteAddressMutation();
    const { data: addresses, isLoading } = useMyAddressQuery(undefined);

    if (isLoading) return <SpinnerLoading />;

    const handleCloseDrawer = () => {
        setSelectedAddress(null);
    };

    const onEditClick = (address: TAddress) => {
        setSelectedAddress(address);
    };

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await deleteAddress(id).unwrap();
            toast.success("Address deleted successfully");
        } catch (error) {
            toast.error("Failed to delete address");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-5">
                {addresses?.result?.map((address) => (
                    <div
                        className="p-4 rounded-md bg-white flex items-center justify-between"
                        key={address.id}
                    >
                        <div className="flex items-center gap-x-4">
                            <p>
                                {address.fullName}, {address.street},{" "}
                                {address.country}
                            </p>
                            {address.isDefault && (
                                <p className="text-primary text-sm bg-primary/10 px-2 py-1 rounded-md">
                                    Default
                                </p>
                            )}
                        </div>
                        <div className="flex gap-x-2">
                            <TDButton
                                variant="outline"
                                size="icon"
                                onClick={() => onEditClick(address)}
                            >
                                <Edit />
                            </TDButton>
                            <TDButton
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(address.id)}
                                isLoading={deletingId === address.id}
                            >
                                <Trash />
                            </TDButton>
                        </div>
                    </div>
                ))}
            </div>

            <TDSheet
                title="Edit Address"
                isOpen={!!selectedAddress}
                setIsOpen={(open) => {
                    if (!open) handleCloseDrawer();
                }}
            >
                {selectedAddress && (
                    <EditAddress
                        handleCloseDrawer={handleCloseDrawer}
                        selectedAddress={selectedAddress}
                    />
                )}
            </TDSheet>
        </>
    );
}
