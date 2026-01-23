import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { productsImage } from "@/helping-data/image";
import Image from "next/image";

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
];

export default function TopProducts() {
    return (
        <div className="bg-white rounded-2xl shadow-2xl p-5 lg:col-span-3">
            <h4 className="mb-10 font-semibold text-black">Top Products</h4>
            <Table>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.invoice}>
                            <TableCell className="size-16 bg-gray-100 rounded-md">
                                <Image
                                    src={productsImage.gray}
                                    alt="Product"
                                    height={40}
                                    width={40}
                                    className="size-12 object-center object-cover rounded-md"
                                />
                            </TableCell>
                            <TableCell className="font-semibold text-base">
                                Product name here
                            </TableCell>
                            <TableCell>{invoice.paymentMethod}</TableCell>
                            <TableCell className="text-right">
                                {invoice.totalAmount}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
