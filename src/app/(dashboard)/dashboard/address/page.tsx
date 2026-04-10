import AddNewAddress from "@/components/@dashboard/customer/address/add-new-address";
import AddressList from "@/components/@dashboard/customer/address/address-list";

export default function AddressPage() {
    return (
        <div className="space-y-5 bg-white p-5 lg:p-10 rounded-2xl shadow">
            <AddressList />
            <AddNewAddress />
        </div>
    );
}
