"use client";

import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import Link from "next/link";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { vendorStatusMap } from "@/features/orders/constants/status-maps";
import { usePlatformSettingsQuery } from "@/features/settings/api/settings.api";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import QueryError from "@/shared/components/query-error";
import RowText from "@/shared/components/row-text";
import { envConfig } from "@/shared/config/env-config";
import { StatusBadge } from "@/shared/ui/status-badge";

const percent = (fraction: number) => `${(fraction * 100).toFixed(1)}%`;

const FEATURES = [
    { key: "stripePayments", label: "Card payments (Stripe)" },
    { key: "stripeWebhook", label: "Stripe webhook verification" },
    { key: "cloudinary", label: "Image uploads (Cloudinary)" },
    { key: "email", label: "Transactional email" },
    { key: "scheduler", label: "Background sweeps (refund retries, draft expiry)" },
] as const;

/**
 * The platform's configuration, READ-ONLY.
 *
 * Every value is backend environment config, so changing one is a deploy.
 * Several are duplicated here (the tax rate is compiled into checkout's
 * estimate), which is why they are not editable at runtime: a rate changed in
 * the database would make every cart quote a total the backend then refuses
 * to charge. What this screen does instead is compare the two sides and say
 * when they disagree.
 */
export default function PlatformSettings() {
    const { data, isLoading, error, refetch } = usePlatformSettingsQuery();

    if (isLoading) return <SpinnerLoading />;
    if (error) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load platform settings"
            />
        );
    }

    const settings = data?.result;
    if (!settings) return null;

    const { pricing, checkout, features, overrides } = settings;
    const taxMismatch = pricing.taxRate !== envConfig.tax_rate;
    const categoryTaxDrift = overrides.categoryTaxRates.length > 0;

    return (
        <div className="space-y-5">
            <div className="space-y-0.5">
                <h4>Platform settings</h4>
                <p className="text-sm text-muted-foreground">
                    Read-only. These come from the backend&apos;s environment,
                    so a change is a deploy, not an edit here.
                </p>
            </div>

            {(taxMismatch || categoryTaxDrift) && (
                <div
                    role="alert"
                    className="space-y-2 rounded-md border border-destructive-100 bg-destructive-50 p-4 text-sm"
                >
                    <p className="flex items-center gap-2 font-medium text-destructive-600">
                        <CircleAlert className="size-4" />
                        Checkout estimates will not match the charge
                    </p>
                    {taxMismatch && (
                        <p>
                            The backend charges {percent(pricing.taxRate)} tax
                            but this frontend was built with{" "}
                            {percent(envConfig.tax_rate)}. Set{" "}
                            <code>NEXT_PUBLIC_TAX_RATE</code> to{" "}
                            <code>{pricing.taxRate}</code> and redeploy.
                        </p>
                    )}
                    {categoryTaxDrift && (
                        <p>
                            {overrides.categoryTaxRates.length} categor
                            {overrides.categoryTaxRates.length === 1 ? "y has" : "ies have"}{" "}
                            its own tax rate, but the cart still estimates
                            every line at the platform rate (backend BE-38).
                        </p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Pricing */}
                <div className="bg-white rounded-md p-5 space-y-2 text-sm">
                    <h5 className="font-semibold">Tax</h5>
                    <RowText
                        title="Platform rate (backend)"
                        value={percent(pricing.taxRate)}
                    />
                    <RowText
                        title="Checkout estimate (frontend)"
                        value={percent(envConfig.tax_rate)}
                        className={taxMismatch ? "text-destructive-600" : ""}
                    />
                    <p className="text-xs text-muted-foreground">
                        Applies to every category without its own rate.
                    </p>

                    <h5 className="font-semibold pt-3">Category overrides</h5>
                    {overrides.categoryTaxRates.length ? (
                        overrides.categoryTaxRates.map((category) => (
                            <RowText
                                key={category.id}
                                title={category.name}
                                value={
                                    category.taxRate === 0
                                        ? "0% (zero-rated)"
                                        : percent(category.taxRate)
                                }
                            />
                        ))
                    ) : (
                        <p className="text-muted-foreground">
                            None — every category uses the platform rate.
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Set per category in{" "}
                        <Link href="/admin/category-list" className="underline">
                            Categories
                        </Link>
                        .
                    </p>
                </div>

                {/* Store defaults */}
                <div className="bg-white rounded-md p-5 space-y-2 text-sm">
                    <h5 className="font-semibold">New-store defaults</h5>
                    <RowText
                        title="Commission"
                        value={percent(pricing.newStoreDefaults.commissionRate)}
                    />
                    <RowText
                        title="Delivery fee"
                        value={currencyFormatter(
                            pricing.newStoreDefaults.shippingFee,
                        )}
                    />
                    <RowText
                        title="Free delivery over"
                        value={currencyFormatter(
                            pricing.newStoreDefaults.freeShippingThreshold,
                        )}
                    />
                    <p className="text-xs text-muted-foreground">
                        Stamped onto a store when it applies. After that each
                        store keeps its own terms, which is what checkout
                        charges.
                    </p>

                    <h5 className="font-semibold pt-3">Checkout</h5>
                    <RowText
                        title="Unpaid card checkout expires after"
                        value={`${checkout.checkoutSessionTtlMinutes} min`}
                    />
                </div>

                {/* Features */}
                <div className="bg-white rounded-md p-5 space-y-3 text-sm">
                    <h5 className="font-semibold">Integrations</h5>
                    <ul className="space-y-2">
                        {FEATURES.map((feature) => {
                            const on = features[feature.key];
                            return (
                                <li
                                    key={feature.key}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <span>{feature.label}</span>
                                    <span
                                        className={`inline-flex items-center gap-1 text-xs font-medium ${on ? "text-success-600" : "text-destructive-600"}`}
                                    >
                                        {on ? (
                                            <CircleCheck className="size-4" />
                                        ) : (
                                            <CircleX className="size-4" />
                                        )}
                                        {on ? "On" : "Off"}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="text-xs text-muted-foreground">
                        A feature is off when its keys are missing from the
                        backend&apos;s environment. No key is shown here.
                    </p>
                </div>
            </div>

            {/* Per-store terms that differ from the defaults */}
            <div className="bg-white rounded-md p-5 space-y-4">
                <div>
                    <h5 className="font-semibold">Stores on custom terms</h5>
                    <p className="text-xs text-muted-foreground">
                        {overrides.storeTerms.length} of {overrides.totalStores}{" "}
                        store(s) differ from the new-store defaults.
                    </p>
                </div>
                {overrides.storeTerms.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs text-muted-foreground">
                                <tr>
                                    <th className="py-2 font-medium">Store</th>
                                    <th className="py-2 font-medium">Status</th>
                                    <th className="py-2 font-medium text-right">
                                        Commission
                                    </th>
                                    <th className="py-2 font-medium text-right">
                                        Delivery fee
                                    </th>
                                    <th className="py-2 font-medium text-right">
                                        Free over
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {overrides.storeTerms.map((store) => (
                                    <tr key={store.id}>
                                        <td className="py-2">
                                            <Link
                                                href={`/admin/vendor-list/${store.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {store.storeName}
                                            </Link>
                                        </td>
                                        <td className="py-2">
                                            <StatusBadge
                                                statusMap={vendorStatusMap}
                                                status={store.status}
                                            />
                                        </td>
                                        <td className="py-2 text-right">
                                            {percent(store.commissionRate)}
                                        </td>
                                        <td className="py-2 text-right">
                                            {currencyFormatter(store.shippingFee)}
                                        </td>
                                        <td className="py-2 text-right">
                                            {currencyFormatter(
                                                store.freeShippingThreshold,
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Every store is on the default terms.
                    </p>
                )}
            </div>
        </div>
    );
}
