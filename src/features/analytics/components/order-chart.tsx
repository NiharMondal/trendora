"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { useSalesTrendQuery } from "@/features/orders/api/order.api";
import type {
    TSalesTrend,
    TSalesTrendPoint,
} from "@/features/orders/types/order.types";
import DateRangeSelect, {
    useDateRange,
} from "@/shared/components/date-range-select";
import QueryError from "@/shared/components/query-error";
import { formatDate } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/ui/chart";
import { Skeleton } from "@/shared/ui/skeleton";

type TMetric = keyof Omit<TSalesTrendPoint, "date">;

const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact" });
const compactCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
});

const METRICS: {
    key: TMetric;
    label: string;
    format: (value: number) => string;
    axisFormat: (value: number) => string;
}[] = [
    {
        key: "grossSales",
        label: "Gross sales",
        format: currencyFormatter,
        axisFormat: (value) => compactCurrency.format(value),
    },
    {
        key: "commission",
        label: "Commission",
        format: currencyFormatter,
        axisFormat: (value) => compactCurrency.format(value),
    },
    {
        key: "orders",
        label: "Orders",
        format: (value) => value.toLocaleString("en-US"),
        axisFormat: (value) => compactNumber.format(value),
    },
];

// One series at a time, so all three share the brand color. Orders and money
// are never drawn together: that would need two y-axes.
const chartConfig = {
    grossSales: { label: "Gross sales", color: "var(--color-primary-500)" },
    commission: { label: "Commission", color: "var(--color-primary-500)" },
    orders: { label: "Orders", color: "var(--color-primary-500)" },
} satisfies ChartConfig;

const bucketLabel = (date: string, granularity: TSalesTrend["granularity"]) =>
    formatDate(date, granularity === "day" ? "ll" : "MMM YYYY");

const tickLabel = (date: string, granularity: TSalesTrend["granularity"]) =>
    formatDate(date, granularity === "day" ? "MMM Do" : "MMM/YY");

/**
 * Platform sales over time on the admin dashboard.
 *
 * The metric buttons double as the headline totals for the window. They sum
 * the same series the chart draws, and the backend applies the same rules as
 * `MarketplaceOverview`'s tiles, so for an equal range the numbers agree —
 * `grossSales` is GMV, not platform revenue; `commission` is what Trendora
 * keeps.
 */
export default function OrderChart() {
    const { range, setRangeValue } = useDateRange("30");
    const [metric, setMetric] = useState<TMetric>("grossSales");
    const { data, isLoading, isFetching, error, refetch } = useSalesTrendQuery(
        range.params,
    );

    const trend = data?.result;
    const points = trend?.points ?? [];
    const granularity = trend?.granularity ?? "day";
    const active = METRICS.find((item) => item.key === metric) ?? METRICS[0];
    const totals = Object.fromEntries(
        METRICS.map((item) => [
            item.key,
            points.reduce((sum, point) => sum + point[item.key], 0),
        ]),
    ) as Record<TMetric, number>;

    return (
        <section
            aria-labelledby="sales-trend-heading"
            className="bg-white rounded-2xl shadow-2xl p-5 lg:col-span-2 flex flex-col gap-4"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h4
                        id="sales-trend-heading"
                        className="font-semibold text-black"
                    >
                        Sales over time
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        {range.label} · per{" "}
                        {granularity === "day" ? "day" : "month"}
                    </p>
                </div>
                <DateRangeSelect
                    value={range.value}
                    onChange={setRangeValue}
                    isFetching={isFetching}
                    size="sm"
                    
                />
            </div>

            {isLoading ? (
                <>
                    <div className="grid grid-cols-3 gap-2">
                        {METRICS.map((item) => (
                            <Skeleton key={item.key} className="h-16 rounded-lg" />
                        ))}
                    </div>
                    <Skeleton className="h-64 rounded-lg" />
                </>
            ) : error ? (
                <QueryError
                    error={error}
                    onRetry={refetch}
                    title="Could not load sales"
                    className="min-h-[300px]"
                />
            ) : (
                <>
                    <div
                        className="grid grid-cols-3 gap-2"
                        role="group"
                        aria-label="Chart metric"
                    >
                        {METRICS.map((item) => (
                            <Button
                                key={item.key}
                                type="button"
                                variant="ghost"
                                aria-pressed={metric === item.key}
                                onClick={() => setMetric(item.key)}
                                className={cn(
                                    "h-auto flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left",
                                    metric === item.key
                                        ? "border-primary-400 bg-primary-50 hover:bg-primary-50"
                                        : "border-transparent bg-muted/40",
                                )}
                            >
                                <span className="text-xs font-normal text-muted-foreground">
                                    {item.label}
                                </span>
                                <span className="text-base font-semibold text-foreground tabular-nums">
                                    {item.format(totals[item.key])}
                                </span>
                            </Button>
                        ))}
                    </div>

                    {totals.orders === 0 ? (
                        <p className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                            No orders in this period.
                        </p>
                    ) : (
                        <>
                            <ChartContainer
                                config={chartConfig}
                                className={cn(
                                    "aspect-auto h-64 w-full transition-opacity",
                                    isFetching && "opacity-60",
                                )}
                                role="img"
                                aria-label={`${active.label} per ${granularity}, ${range.label.toLowerCase()}`}
                            >
                                <AreaChart
                                    data={points}
                                    margin={{ left: 0, right: 8, top: 8 }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="sales-trend-fill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor={`var(--color-${metric})`}
                                                stopOpacity={0.35}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor={`var(--color-${metric})`}
                                                stopOpacity={0.02}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={28}
                                        tickFormatter={(value: string) =>
                                            tickLabel(value, granularity)
                                        }
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        width={48}
                                        allowDecimals={metric !== "orders"}
                                        tickFormatter={(value: number) =>
                                            active.axisFormat(value)
                                        }
                                    />
                                    <ChartTooltip
                                        cursor={{ strokeDasharray: "4 4" }}
                                        content={
                                            <ChartTooltipContent
                                                indicator="line"
                                                labelFormatter={(value) =>
                                                    bucketLabel(
                                                        String(value),
                                                        granularity,
                                                    )
                                                }
                                                formatter={(value) => (
                                                    <div className="flex w-full justify-between gap-4">
                                                        <span className="text-muted-foreground">
                                                            {active.label}
                                                        </span>
                                                        <span className="font-medium tabular-nums">
                                                            {active.format(
                                                                Number(value),
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            />
                                        }
                                    />
                                    <Area
                                        dataKey={metric}
                                        type="monotone"
                                        stroke={`var(--color-${metric})`}
                                        strokeWidth={2}
                                        fill="url(#sales-trend-fill)"
                                        activeDot={{ r: 4 }}
                                    />
                                </AreaChart>
                            </ChartContainer>

                            {/* The chart is an image to a screen reader; this is
                                its data. */}
                            <table className="sr-only">
                                <caption>
                                    {active.label} per {granularity},{" "}
                                    {range.label.toLowerCase()}
                                </caption>
                                <thead>
                                    <tr>
                                        <th scope="col">Period</th>
                                        <th scope="col">{active.label}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {points.map((point) => (
                                        <tr key={point.date}>
                                            <td>
                                                {bucketLabel(point.date, granularity)}
                                            </td>
                                            <td>{active.format(point[metric])}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </>
            )}
        </section>
    );
}
