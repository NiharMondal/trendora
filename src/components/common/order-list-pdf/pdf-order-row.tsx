import { TOrder } from "@/components/types/order.types";
import { formatMonthDateYear } from "@/lib/format-date-time";
import { Text, View } from "@react-pdf/renderer";
import { fmt, s, STATUS_COLORS } from "./pdf-styles";

interface Props {
    order: TOrder;
    index: number;
}

function OrderItemsTable({ order }: { order: TOrder }) {
    if (!order.items?.length) return null;

    const itemsSubtotal = order.items.reduce(
        (sum, it) =>
            sum + Number(it?.priceAtPurchase ?? 0) * Number(it?.quantity ?? 0),
        0,
    );
    const shipping = Number(order.shippingCost ?? 0);
    const tax = Number(order.tax ?? 0);
    const discount = Number(order.discount ?? 0);

    return (
        <View style={s.itemsWrap} wrap={false}>
            <Text style={s.itemsLabel}>ITEMS</Text>

            <View style={s.itemsHead}>
                <Text style={[s.itemsHeadText, s.itemColName]}>PRODUCT</Text>
                <Text style={[s.itemsHeadText, s.itemColQty]}>QTY</Text>
                <Text style={[s.itemsHeadText, s.itemColPrice]}>PRICE</Text>
                <Text style={[s.itemsHeadText, s.itemColTotal]}>SUBTOTAL</Text>
            </View>

            {order.items.map((item, idx) => {
                const price = Number(item?.priceAtPurchase ?? 0);
                const qty = Number(item?.quantity ?? 0);
                return (
                    <View key={idx} style={s.itemRow}>
                        <View style={s.itemColName}>
                            <Text style={s.itemName}>{item?.productName}</Text>
                            {item?.variantDetails ? (
                                <Text style={s.itemCellMuted}>
                                    {item.variantDetails}
                                </Text>
                            ) : null}
                        </View>
                        <Text style={[s.itemCell, s.itemColQty]}>{qty}</Text>
                        <Text style={[s.itemCell, s.itemColPrice]}>
                            {fmt(price)}
                        </Text>
                        <Text
                            style={[
                                s.itemCell,
                                s.itemColTotal,
                                { fontFamily: "Helvetica-Bold" },
                            ]}
                        >
                            {fmt(price * qty)}
                        </Text>
                    </View>
                );
            })}

            <View style={s.totalsBlock}>
                <View style={s.totalsRow}>
                    <Text style={s.totalsLabel}>Items Subtotal</Text>
                    <Text style={s.totalsValue}>{fmt(itemsSubtotal)}</Text>
                </View>
                <View style={s.totalsRow}>
                    <Text style={s.totalsLabel}>Shipping</Text>
                    <Text style={s.totalsValue}>{fmt(shipping)}</Text>
                </View>
                <View style={s.totalsRow}>
                    <Text style={s.totalsLabel}>Tax</Text>
                    <Text style={s.totalsValue}>{fmt(tax)}</Text>
                </View>
                {discount > 0 && (
                    <View style={s.totalsRow}>
                        <Text style={s.totalsLabel}>Discount</Text>
                        <Text style={s.totalsValue}>-{fmt(discount)}</Text>
                    </View>
                )}
                <View style={s.totalsGrand}>
                    <Text style={s.totalsGrandLabel}>Order Total</Text>
                    <Text style={s.totalsGrandValue}>
                        {fmt(Number(order.totalAmount))}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export function PDFOrderRow({ order, index }: Props) {
    const color = STATUS_COLORS[order.orderStatus] ?? {
        bg: "#F0F0F0",
        text: "#555",
    };

    return (
        <View>
            <View style={[s.tableRow, index % 2 !== 0 ? s.tableRowAlt : {}]}>
                <Text style={[s.cellMuted, s.colNo]}>{index + 1}</Text>
                <Text style={[s.cellMono, s.colId]}>{order.orderNumber}</Text>
                <Text style={[s.cellMuted, s.colDate]}>
                    {order.createdAt
                        ? formatMonthDateYear(order.createdAt)
                        : "—"}
                </Text>
                <View style={s.colStatus}>
                    <View
                        style={[
                            s.statusBadge,
                            { backgroundColor: color.bg },
                        ]}
                    >
                        <Text style={[s.statusText, { color: color.text }]}>
                            {order.orderStatus}
                        </Text>
                    </View>
                </View>
                <Text style={[s.cellMuted, s.colPay]}>
                    {order.paymentMethod ?? "—"}
                </Text>
                <View style={s.colTotal}>
                    <Text style={[s.cell, { fontFamily: "Helvetica-Bold" }]}>
                        {fmt(Number(order.totalAmount))}
                    </Text>
                </View>
            </View>

            <OrderItemsTable order={order} />
        </View>
    );
}
