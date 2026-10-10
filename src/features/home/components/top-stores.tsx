"use client";

import { ArrowRight, Star, Store, Truck } from "lucide-react";
import Link from "next/link";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { useAllStoresQuery } from "@/features/vendors/api/vendor.api";
import Container from "@/shared/components/container";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * "Meet the sellers" — the section a single-vendor shop cannot have, and the
 * clearest statement that Trendora is a marketplace.
 *
 * Each card leads with the store's own delivery terms, because those are per
 * store and decide what the buyer pays: a cart spanning two stores is charged
 * two shipping fees, each judged against its own threshold.
 */
export default function TopStores() {
    const { data, isLoading } = useAllStoresQuery({
        limit: "6",
        sortBy: "averageRating:desc",
    });

    const stores = data?.result ?? [];

    if (!isLoading && stores.length === 0) return null;

    return (
        <section className="py-10">
            <Container className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold">
                            Sellers on Trendora
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Independent stores, one checkout.
                        </p>
                    </div>

                    <Link
                        href="/stores"
                        className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                        All stores
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading
                        ? Array.from({ length: 3 }, (_, index) => (
                              <Skeleton key={index} className="h-[132px] w-full rounded-lg" />
                          ))
                        : stores.map((store) => {
                              const threshold = Number(
                                  store.freeShippingThreshold ?? 0,
                              );

                              return (
                                  <Link
                                      key={store.id}
                                      href={`/stores/${store.slug}`}
                                      className="flex gap-4 rounded-lg border border-muted bg-white p-5 transition-shadow hover:shadow-md"
                                  >
                                      <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-50">
                                          {store.logo ? (
                                              // eslint-disable-next-line @next/next/no-img-element
                                              <img
                                                  src={store.logo}
                                                  alt=""
                                                  aria-hidden
                                                  className="size-full object-cover"
                                              />
                                          ) : (
                                              <Store className="size-6 text-primary" />
                                          )}
                                      </span>

                                      <div className="min-w-0 space-y-1">
                                          <p className="truncate font-semibold">
                                              {store.storeName}
                                          </p>

                                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                              {store.averageRating ? (
                                                  <>
                                                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                                      {Number(
                                                          store.averageRating,
                                                      ).toFixed(1)}{" "}
                                                      ({store.totalReviews})
                                                  </>
                                              ) : (
                                                  "No reviews yet"
                                              )}
                                          </p>

                                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                              <Truck className="size-3.5" />
                                              {threshold > 0
                                                  ? `Free over ${currencyFormatter(threshold)}`
                                                  : `${currencyFormatter(Number(store.shippingFee ?? 0))} delivery`}
                                          </p>
                                      </div>
                                  </Link>
                              );
                          })}
                </div>
            </Container>
        </section>
    );
}
