import ProductTable from "./product-table";

export default function ProductListPage() {
	return (
		<div className="space-y-4">
			<h4>Product List</h4>
			<div className="bg-white p-5 rounded-2xl shadow-2xl space-y-5">
				<p className="text-muted-foreground">
					Tip search by Product Name: Each product is provided with a
					unique Name, which you can rely on to find the exact product
					you need.
				</p>
				<ProductTable />
			</div>
		</div>
	);
}
