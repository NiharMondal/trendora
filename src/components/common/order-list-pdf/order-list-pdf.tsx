import { TOrder } from "@/components/types/order.types";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { PDFFooter } from "./pdf-footer";
import { PDFHeader } from "./pdf-header";
import { PDFOrderRow } from "./pdf-order-row";
import { fmt, ORDER_TABLE_HEADERS, ORDER_TABLE_WIDTHS, s } from "./pdf-styles";
import { PDFSummary } from "./pdf-summary";

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

                <PDFHeader />

                <PDFSummary
                    totalOrders={orders.length}
                    totalRevenue={totalRevenue}
                    delivered={delivered}
                />

                <View style={s.tableHead}>
                    {ORDER_TABLE_HEADERS.map((h, i) => (
                        <Text
                            key={h}
                            style={[
                                s.thText,
                                ORDER_TABLE_WIDTHS[i],
                                i === ORDER_TABLE_HEADERS.length - 1
                                    ? { textAlign: "right" }
                                    : {},
                            ]}
                        >
                            {h}
                        </Text>
                    ))}
                </View>

                {orders.map((order, i) => (
                    <PDFOrderRow key={order.id} order={order} index={i} />
                ))}

                <View style={s.totalBar}>
                    <Text style={s.totalLabel}>Total spent</Text>
                    <Text style={s.totalValue}>{fmt(totalRevenue)}</Text>
                </View>

                <PDFFooter />
            </Page>
        </Document>
    );
}
