import { TOrder } from "@/components/types/order.types";
import { formatMonthDateYear } from "@/lib/format-date-time";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    DELIVERED: { bg: "#EAF3DE", text: "#3B6D11" },
    PROCESSING: { bg: "#E6F1FB", text: "#185FA5" },
    PENDING: { bg: "#FAEEDA", text: "#854F0B" },
    CANCELLED: { bg: "#FCEBEB", text: "#A32D2D" },
    SHIPPED: { bg: "#EEEDFE", text: "#534AB7" },
};

const s = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 10,
        paddingTop: 44,
        paddingBottom: 48,
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
        color: "#111111",
    },
    accentBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: "#111111",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 24,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
    },
    brand: { fontSize: 18, fontFamily: "Helvetica-Bold", letterSpacing: 1 },
    brandSub: { fontSize: 8, color: "#999999", marginTop: 2 },
    docTitle: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        textAlign: "right",
    },
    docMeta: { fontSize: 8, color: "#888888", marginTop: 3 },
    summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
    summaryCard: {
        flex: 1,
        backgroundColor: "#F7F7F5",
        borderRadius: 5,
        padding: 10,
    },
    summaryLabel: {
        fontSize: 7.5,
        color: "#999999",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    summaryValue: { fontSize: 15, fontFamily: "Helvetica-Bold" },
    summaryNote: { fontSize: 8, color: "#999999", marginTop: 2 },
    tableHead: {
        flexDirection: "row",
        backgroundColor: "#111111",
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 1,
    },
    thText: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 9,
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#EEEEEE",
        alignItems: "center",
    },
    tableRowAlt: { backgroundColor: "#FAFAFA" },
    cell: { fontSize: 9.5, color: "#111111" },
    cellMuted: { fontSize: 9.5, color: "#666666" },
    cellMono: { fontSize: 9, fontFamily: "Courier", color: "#333333" },
    statusBadge: {
        borderRadius: 99,
        paddingVertical: 2,
        paddingHorizontal: 7,
        alignSelf: "flex-start",
    },
    statusText: { fontSize: 8, fontFamily: "Helvetica-Bold" },
    colNo: { width: "4%" },
    colId: { width: "22%" },
    colDate: { width: "15%" },
    colStatus: { width: "15%" },
    colPay: { width: "34%" },
    colTotal: { width: "10%", alignItems: "flex-end" },
    totalBar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        borderTopWidth: 1,
        borderTopColor: "#111111",
        paddingTop: 10,
        marginTop: 4,
        gap: 24,
    },
    totalLabel: { fontSize: 10, color: "#666666" },
    totalValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    footer: {
        position: "absolute",
        bottom: 24,
        left: 40,
        right: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 0.5,
        borderTopColor: "#DDDDDD",
        paddingTop: 8,
    },
    footerText: { fontSize: 8, color: "#AAAAAA" },
    footerBrand: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: "#999999",
    },
});

const fmt = (n: number) =>
    "$" + (n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

const header = ["#", "ORDER ID", "DATE", "STATUS", "PAYMENT", "TOTAL"];
const headerWidths = [
    { width: "4%" },
    { width: "22%" },
    { width: "15%" },
    { width: "15%" },
    { width: "34%" },
    { width: "10%" },
];
interface Props {
    orders: TOrder[];
}

export function OrderListPDF({ orders }: Props) {
    const totalRevenue = orders.reduce(
        (sum, o) => sum + Number(o.totalAmount),
        0,
    );
    const delivered = orders.filter(
        (o) => o.orderStatus === "DELIVERED",
    ).length;

    return (
        <Document>
            <Page size="A4" style={s.page}>
                <View style={s.accentBar} />

                <View style={s.header}>
                    <View>
                        <Text style={s.brand}>MY ORDERS</Text>
                        <Text style={s.brandSub}>Order History Report</Text>
                    </View>
                    <View>
                        <Text style={s.docTitle}>ORDER LIST</Text>
                        <Text style={s.docMeta}>
                            Generated:{" "}
                            {formatMonthDateYear(new Date().toString())}
                        </Text>
                    </View>
                </View>

                <View style={s.summaryRow}>
                    <View style={s.summaryCard}>
                        <Text style={s.summaryLabel}>TOTAL ORDERS</Text>
                        <Text style={s.summaryValue}>{orders.length}</Text>
                        <Text style={s.summaryNote}>All time</Text>
                    </View>
                    <View style={s.summaryCard}>
                        <Text style={s.summaryLabel}>TOTAL SPENT</Text>
                        <Text style={s.summaryValue}>{fmt(totalRevenue)}</Text>
                        <Text style={s.summaryNote}>Combined value</Text>
                    </View>
                    <View style={s.summaryCard}>
                        <Text style={s.summaryLabel}>DELIVERED</Text>
                        <Text style={s.summaryValue}>{delivered}</Text>
                        <Text style={s.summaryNote}>
                            {orders.length > 0
                                ? Math.round((delivered / orders.length) * 100)
                                : 0}
                            % of orders
                        </Text>
                    </View>
                </View>

                <View style={s.tableHead}>
                    {header.map((h, i) => {
                        const headerStyles = headerWidths[i];
                        const isLastIndex = header.length - 1 == i;
                        return (
                            <Text
                                key={h}
                                style={[
                                    s.thText,
                                    headerStyles,
                                    isLastIndex ? { textAlign: "right" } : {},
                                ]}
                            >
                                {h}
                            </Text>
                        );
                    })}
                </View>

                {orders.map((order, i) => {
                    const color = STATUS_COLORS[order.orderStatus] ?? {
                        bg: "#F0F0F0",
                        text: "#555",
                    };
                    return (
                        <View key={order.id}>
                            <View
                                style={[
                                    s.tableRow,
                                    i % 2 !== 0 ? s.tableRowAlt : {},
                                ]}
                            >
                                <Text style={[s.cellMuted, s.colNo]}>
                                    {i + 1}
                                </Text>
                                <Text style={[s.cellMono, s.colId]}>
                                    {order.orderNumber}
                                </Text>
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
                                        <Text
                                            style={[
                                                s.statusText,
                                                { color: color.text },
                                            ]}
                                        >
                                            {order.orderStatus}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[s.cellMuted, s.colPay]}>
                                    {order.paymentMethod ?? "—"}
                                </Text>
                                <View style={s.colTotal}>
                                    <Text
                                        style={[
                                            s.cell,
                                            { fontFamily: "Helvetica-Bold" },
                                        ]}
                                    >
                                        {fmt(Number(order.totalAmount))}
                                    </Text>
                                </View>
                            </View>
                            {order?.items?.map((item, i) => (
                                <View key={i}>
                                    <View>
                                        <Text>Name: {item?.productName}</Text>
                                        <Text>
                                            Details: {item?.variantDetails}
                                        </Text>
                                        <Text>Quantity: {item?.quantity}</Text>
                                        <Text>Price: {item?.priceAtPurchase}</Text>
                                        <Text>Total: {Number(item?.priceAtPurchase) * item?.quantity}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    );
                })}

                <View style={s.totalBar}>
                    <Text style={s.totalLabel}>Total spent</Text>
                    <Text style={s.totalValue}>{fmt(totalRevenue)}</Text>
                </View>

                <View style={s.footer} fixed>
                    <Text style={s.footerBrand}>MY ORDERS</Text>
                    <Text style={s.footerText}>
                        Personal order history — confidential
                    </Text>
                    <Text
                        style={s.footerText}
                        render={({ pageNumber, totalPages }) =>
                            `Page ${pageNumber} of ${totalPages}`
                        }
                    />
                </View>
            </Page>
        </Document>
    );
}
