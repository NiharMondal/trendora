import {
	Calendar,
	Home,
	Inbox,
	type LucideIcon,
	Search,
	Settings,
	User,
	Layers,
	ShoppingCart,
	FilePlus,
	User2,
	Feather,
	Star,
	Coffee,
} from "lucide-react";
type TChildren = {
	name: string;
	url: string;
};
type TSidebarLink = {
	title: string;
	url?: string;
	icon?: LucideIcon;
	children?: TChildren[];
};
export const adminNavlink: TSidebarLink[] = [
	{ title: "Dashboard", url: "/admin", icon: Home },
	{
		title: "Products",
		icon: ShoppingCart,
		children: [
			{ name: "Add Product", url: "/admin/add-product" },
			{ name: "Product List", url: "/admin/product-list" },
		],
	},
	{
		title: "Category",
		icon: Layers,
		children: [
			{ name: "Category List", url: "/admin/category-list" },
			{ name: "New Category", url: "/admin/new-category" },
		],
	},
	{
		title: "Order History",
		icon: FilePlus,
		children: [
			{ name: "Order List", url: "/admin/order-list" },
			{ name: "Order Details", url: "/admin/order-details" },
		],
	},
	{
		title: "User",
		url: "/admin/user",
		icon: User2,
	},
	{
		title: "Featured Products",
		url: "/admin/featured-products",
		icon: Feather,
	},
	{ title: "Reviews", url: "/admin/reviews", icon: Star },
	{ title: "Hot Offers", url: "/admin/hot-offers", icon: Coffee },
];

export const customerNavlink: TSidebarLink[] = [
	{ title: "Dashboard", url: "/dashboard", icon: Home },
	{ title: "My Orders", url: "/dashboard/my-orders", icon: Home },
	{
		title: "Account Information",
		url: "/dashboard/account-information",
		icon: Home,
	},
	{ title: "Address", url: "/dashboard/address", icon: Home },
];
