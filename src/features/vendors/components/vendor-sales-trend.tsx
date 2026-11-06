"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { TVendorSalesPoint } from "@/features/vendors/types/vendor.types";
import { formatDate } from "@/shared/lib/format-date-time";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/ui/chart";

const chartConfig = {
    grossSales: { label: "Gross sales", color: "var(--color-primary-300)" },
    netEarnings: { label: "Net earnings", color: "var(--color-primary-600)" },
} satisfies ChartConfig;

/**
 * Daily sales for the seller's own store.
 *
 * Net is drawn over gross on purpose: the gap between the two lines is the
 * platform's commission plus the tax it remits, which is the thing a seller
 * most often misreads when they compare the dashboard with a payout.
 */
export default function VendorSalesTrend({
    points,
    caption,
}: {
    points: TVendorSalesPoint[];
    caption: string;
}) {
    const totalOrders = points.reduce((sum, point) => sum + point.orders, 0);

    return (
        <div className="bg-white rounded-md p-5 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h5 className="font-semibold">Sales over time</h5>
                <p className="text-xs text-muted-foreground">
                    {caption} · {totalOrders} parcel(s) placed
                </p>
            </div>

            {totalOrders === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No orders in this period.
                </p>
            ) : (
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-64 w-full"
                    role="img"
                    aria-label={`Daily gross sales and net earnings, ${caption.toLowerCase()}`}
                >
                    <AreaChart data={points} margin={{ left: 4, right: 4 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            minTickGap={24}
                            tickFormatter={(value: string) =>
                                formatDate(value, "MMM Do")
                            }
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            width={56}
                            tickFormatter={(value: number) =>
                                currencyFormatter(value)
                            }
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        formatDate(String(value), "ll")
                                    }
                                    formatter={(value, name) => (
                                        <div className="flex w-full justify-between gap-4">
                                            <span className="text-muted-foreground">
                                                {chartConfig[
                                                    name as keyof typeof chartConfig
                                                ]?.label ?? name}
                                            </span>
                                            <span className="font-medium">
                                                {currencyFormatter(Number(value))}
                                            </span>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <Area
                            dataKey="grossSales"
                            type="monotone"
                            stroke="var(--color-grossSales)"
                            fill="var(--color-grossSales)"
                            fillOpacity={0.2}
                        />
                        <Area
                            dataKey="netEarnings"
                            type="monotone"
                            stroke="var(--color-netEarnings)"
                            fill="var(--color-netEarnings)"
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                </ChartContainer>
            )}
        </div>
    );
}
