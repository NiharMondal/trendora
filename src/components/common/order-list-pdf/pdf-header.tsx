import { Text, View } from "@react-pdf/renderer";
import moment from "moment";
import { s } from "./pdf-styles";

export function PDFHeader() {
    return (
        <View style={s.header}>
            <View>
                <Text style={s.brand}>MY ORDERS</Text>
                <Text style={s.brandSub}>Order History Report</Text>
            </View>
            <View>
                <Text style={s.docTitle}>ORDER LIST</Text>
                <Text style={s.docMeta}>
                    Generated: {moment().format("ll")}
                </Text>
            </View>
        </View>
    );
}
