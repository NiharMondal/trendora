"use client";
import { OrderListPDF } from "@/components/common/order-list-pdf/order-list-pdf";
import { TOrder } from "@/components/types/order.types";
import { Button } from "@/components/ui/button";
import { BlobProvider } from "@react-pdf/renderer";
import { Download, Printer } from "lucide-react";
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
    { ssr: false, loading: () => <span>Loading...</span> },
);

export function DownloadButton({ orders }: { orders: TOrder[] }) {
    const filename = `my-orders.pdf`;

    return (
        <PDFDownloadLink
            document={<OrderListPDF orders={orders} />}
            fileName={filename}
        >
            {({ loading }) => (
                <Button variant="outline" disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    {loading ? "Preparing..." : "Print"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}

export function PrintButton({ orders }: { orders: TOrder[] }) {
       const handlePrint = (blob: Blob | null) => {
           if (!blob) return;

           const url = URL.createObjectURL(blob);

           // Create a hidden iframe — no new tab opens
           const iframe = document.createElement("iframe");
           iframe.style.display = "none";
           iframe.src = url;
           document.body.appendChild(iframe);

           iframe.onload = () => {
               iframe.contentWindow?.focus();
               iframe.contentWindow?.print();

               // Clean up after print dialog closes
               setTimeout(() => {
                   document.body.removeChild(iframe);
                   URL.revokeObjectURL(url);
               }, 10_000);
           };
       };
    return (
        <BlobProvider document={<OrderListPDF orders={orders} />}>
            {({ blob, loading }) => {
                return (
                    <Button
                        variant="outline"
                        disabled={loading}
                        onClick={()=>handlePrint(blob)}
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        {loading ? "Preparing..." : "Print"}
                    </Button>
                );
            }}
        </BlobProvider>
    );
}
