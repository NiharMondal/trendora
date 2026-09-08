"use client";

import Link from "next/link";
import { Clock, Store, XCircle } from "lucide-react";

import { useMyStoreQuery } from "@/features/vendors/api/vendor.api";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import { Button } from "@/shared/ui/button";

import VendorApplyForm from "./vendor-apply-form";

/**
 * Decides what a visitor to /vendor/apply should see.
 *
 * `GET /vendors/me` 404s when the caller has never applied — that is the
 * normal case here, not an error, so it selects the form rather than surfacing
 * a failure. An existing application shows its state instead, and a REJECTED
 * one shows the reason plus the form again (the backend reuses the same row on
 * re-application).
 */
export default function VendorApplyGate() {
    const { data, isLoading } = useMyStoreQuery();

    if (isLoading) return <SpinnerLoading />;

    const store = data?.result;

    if (!store) {
        return (
            <div className="space-y-5">
                <Intro />
                <VendorApplyForm />
            </div>
        );
    }

    if (store.status === "PENDING") {
        return (
            <StatusPanel
                icon={<Clock className="size-8 text-amber-500" />}
                title="Your application is under review"
                body={`We're looking at "${store.storeName}". You'll be able to list products as soon as it's approved.`}
            />
        );
    }

    if (store.status === "REJECTED") {
        return (
            <div className="space-y-5">
                <StatusPanel
                    icon={<XCircle className="size-8 text-red-500" />}
                    title="Your application was not approved"
                    body={
                        store.rejectionReason ??
                        "Please review your details and apply again."
                    }
                />
                <VendorApplyForm />
            </div>
        );
    }

    if (store.status === "SUSPENDED") {
        return (
            <StatusPanel
                icon={<XCircle className="size-8 text-orange-500" />}
                title="Your store is suspended"
                body={
                    store.rejectionReason ??
                    "Contact support to get your store reinstated."
                }
            />
        );
    }

    // APPROVED — nothing to apply for.
    return (
        <StatusPanel
            icon={<Store className="size-8 text-green-600" />}
            title={`${store.storeName} is live`}
            body="Head to your seller dashboard to manage products and orders."
            action={
                <Link href="/vendor">
                    <Button>Go to seller dashboard</Button>
                </Link>
            }
        />
    );
}

function Intro() {
    return (
        <div className="bg-white rounded-md p-5 space-y-2">
            <h2>Sell on Trendora</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
                Open a store, list your products and get paid for what you sell.
                We review every application, and every listing, before it
                reaches shoppers — so tell us a bit about your business below.
            </p>
        </div>
    );
}

function StatusPanel({
    icon,
    title,
    body,
    action,
}: {
    icon: React.ReactNode;
    title: string;
    body: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-md p-8 flex flex-col items-center text-center gap-3">
            {icon}
            <h3>{title}</h3>
            <p className="text-sm text-muted-foreground max-w-xl">{body}</p>
            {action}
        </div>
    );
}
