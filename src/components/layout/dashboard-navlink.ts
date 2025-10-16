import { Calendar, Home, Inbox, Search, Settings, User } from "lucide-react";
export const adminNavlink = [
	{ title: "Dashboard", url: "/admin", icon: Home },
	{ title: "Products", url: "/admin/products", icon: Calendar },
	{ title: "Order History", url: "/admin/order-history", icon: Inbox },
	{
		title: "Featured Products",
		url: "/admin/featured-products",
		icon: Search,
	},
	{ title: "Reviews", url: "/admin/reviews", icon: Settings },
	{ title: "Hot Offers", url: "/admin/offers", icon: User },
];

export const customerNavlink = [
	{ title: "Dashboard", url: "/dashboard", icon: Home },
	{ title: "My Orders", url: "/dashboard/my-orders", icon: Home },
	{
		title: "Account Information",
		url: "/dashboard/account-information",
		icon: Home,
	},
	{ title: "Address", url: "/dashboard/address", icon: Home },
];
