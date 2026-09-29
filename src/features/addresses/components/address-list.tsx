"use client";

import { Edit, Trash } from "lucide-react";

import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import NoDataFound from "@/shared/components/no-data-found";
import TDButton from "@/shared/components/td-button";
import TDSheet from "@/shared/components/td-sheet";
import { TAddress } from "@/features/addresses/types/address.types";
import {
	useDeleteAddressMutation,
	useMyAddressQuery,
} from "@/features/addresses/api/address.api";
import React, { useState } from "react";
import { toast } from "sonner";
import EditAddress from "./edit-address";
import QueryError from "@/shared/components/query-error";
import ConfirmModal from "@/shared/components/confirm-modal";

export default function AddressList() {
	// The address awaiting confirmation; the modal is open while this is set.
	const [addressToDelete, setAddressToDelete] = useState<TAddress | null>(
		null,
	);
	const [selectedAddress, setSelectedAddress] = useState<TAddress | null>(
		null,
	);
	const [deleteAddress, { isLoading: isDeleting }] =
		useDeleteAddressMutation();
	const {
	    data: addresses,
	    isLoading,
	    error: loadError,
	    refetch: retryLoad,
	} = useMyAddressQuery(undefined);

	const handleCloseDrawer = () => {
		setSelectedAddress(null);
	};

	const onEditClick = (address: TAddress) => {
		setSelectedAddress(address);
	};

	const confirmDelete = async () => {
		if (!addressToDelete) return;
		try {
			await deleteAddress(addressToDelete.id).unwrap();
			toast.success("Address deleted successfully");
			setAddressToDelete(null);
		} catch {
			// Keep the modal open so the user can retry or cancel.
			toast.error("Failed to delete address");
		}
	};

	if (isLoading) return <SpinnerLoading />;
	if (loadError) {
		return (
			<QueryError
				error={loadError}
				onRetry={retryLoad}
				title="Could not load your addresses"
			/>
		);
	}

	const addressList = addresses?.result ?? [];

	if (addressList.length === 0) {
		return (
			<NoDataFound
				title="No addresses yet"
				description="You haven't added any addresses. Add one to speed up checkout."
			/>
		);
	}

	return (
		<React.Fragment>
			<div className="grid grid-cols-1 gap-5">
				{addressList.map((address) => (
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
								aria-label={`Edit address: ${address.street}, ${address.city}`}
								onClick={() => onEditClick(address)}
							>
								<Edit />
							</TDButton>
							<TDButton
								variant="destructive"
								size="icon"
								aria-label={`Delete address: ${address.street}, ${address.city}`}
								onClick={() => setAddressToDelete(address)}
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

			<ConfirmModal
				open={!!addressToDelete}
				onOpenChange={(open) => !open && setAddressToDelete(null)}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete this address?"
				description={
					addressToDelete
						? `${addressToDelete.fullName}, ${addressToDelete.street}, ${addressToDelete.city} will be removed from your saved addresses. This action cannot be undone.`
						: undefined
				}
			/>
		</React.Fragment>
	);
}
