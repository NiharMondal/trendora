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
	title: string;
	url: string;
	index?: boolean;
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
			{ title: "Add Product", url: "/admin/add-product", index: true },
			{ title: "Product List", url: "/admin/product-list" },
		],
	},
	{
		title: "Category",
		icon: Layers,
		children: [
			{
				title: "Category List",
				url: "/admin/category-list",
				index: true,
			},
			{ title: "New Category", url: "/admin/new-category" },
		],
	},
	{
		title: "Order History",
		icon: FilePlus,
		children: [
			{ title: "Order List", url: "/admin/order-list", index: true },
			{ title: "Order Details", url: "/admin/order-details/" },
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
