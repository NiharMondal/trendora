import { Text, View } from "@react-pdf/renderer";
import { fmt, s } from "./pdf-styles";

interface Props {
    totalOrders: number;
    totalRevenue: number;
    delivered: number;
}

export function PDFSummary({ totalOrders, totalRevenue, delivered }: Props) {
    const deliveryRate =
        totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : 0;

    return (
        <View style={s.summaryRow}>
            <View style={s.summaryCard}>
                <Text style={s.summaryLabel}>TOTAL ORDERS</Text>
                <Text style={s.summaryValue}>{totalOrders}</Text>
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
                <Text style={s.summaryNote}>{deliveryRate}% of orders</Text>
            </View>
        </View>
    );
}
