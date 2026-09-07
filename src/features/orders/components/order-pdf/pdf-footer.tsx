import { Text, View } from "@react-pdf/renderer";
import { s } from "./pdf-styles";

export function PDFFooter() {
    return (
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
    );
}
