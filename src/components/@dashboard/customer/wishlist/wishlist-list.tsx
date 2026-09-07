"use client";

import { HeartOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import NoDataFound from "@/shared/components/no-data-found";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import { TWishlist } from "@/components/types/wishlist.types";
import { Button } from "@/shared/ui/button";
import {
    useMyWishlistQuery,
    useRemoveFromWishlistMutation,
} from "@/redux/api/wishlistApi";

import WishlistCard from "./wishlist-card";

export default function WishlistList() {
    const { data: wishlist, isLoading } = useMyWishlistQuery();
    const [removeFromWishlist, { isLoading: isRemoving }] =
        useRemoveFromWishlistMutation();

    const [selected, setSelected] = useState<TWishlist | null>(null);

    const wishlistItems = wishlist?.result ?? [];

    const confirmRemove = async () => {
        if (!selected) return;
        try {
            await removeFromWishlist(selected.id).unwrap();
            toast.success("Removed from wishlist");
            setSelected(null);
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to remove item");
        }
    };

    if (isLoading) return <SpinnerLoading />;

    if (wishlistItems.length === 0) {
        return (
            <NoDataFound
                icon={HeartOff}
                title="Your wishlist is empty"
                description="Save products you love by tapping the heart icon, and they'll show up here."
            />
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {wishlistItems.map((item) => (
                    <WishlistCard
                        key={item.id}
                        item={item}
                        onRemove={setSelected}
                        isRemoving={isRemoving && selected?.id === item.id}
                    />
                ))}
            </div>

            <TDModal
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
                title="Remove from wishlist?"
                description="This product will be removed from your wishlist."
            >
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setSelected(null)}>
                        Cancel
                    </Button>
                    <TDButton
                        variant="destructive"
                        onClick={confirmRemove}
                        disabled={isRemoving}
                    >
                        {isRemoving ? "Removing..." : "Remove"}
                    </TDButton>
                </div>
            </TDModal>
        </>
    );
}
