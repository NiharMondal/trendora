import {
    BadgeCheck,
    Banknote,
    Blend,
    Boxes,
    Coffee,
    Feather,
    FilePlus,
    Heart,
    Home,
    Key,
    Layers,
    LayoutDashboard,
    type LucideIcon,
    MapPinHouse,
    Scaling,
    ScrollText,
    Settings,
    ShoppingCart,
    Star,
    Stars,
    Store,
    User2,
} from "lucide-react";

type TChildren = {
    title: string;
    url: string;
    index?: boolean;
};

export type TSidebarLink = {
    title: string;
    url?: string;
    icon?: LucideIcon;
    children?: TChildren[];
};

export const adminDashboardLinks: TSidebarLink[] = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    {
        title: "Size Group",
        icon: Boxes,
        children: [
            {
                title: "Size Group List",
                url: "/admin/size-group-list",
                index: true,
            },
            { title: "Add Size Group", url: "/admin/add-size-group" },
        ],
    },
    {
        title: "Size",
        icon: Scaling,
        children: [
            {
                title: "Size List",
                url: "/admin/size-list",
                index: true,
            },
            { title: "Add Size", url: "/admin/add-size" },
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
            { title: "Add Category", url: "/admin/add-category" },
        ],
    },
    {
        title: "Brand",
        icon: Blend,
        children: [
            {
                title: "Brand List",
                url: "/admin/brand-list",
                index: true,
            },
            { title: "Add Brand", url: "/admin/add-brand" },
        ],
    },
    {
        title: "Products",
        icon: ShoppingCart,
        children: [
            { title: "Product List", url: "/admin/product-list", index: true },
            { title: "Add Product", url: "/admin/add-product" },
        ],
    },

    {
        title: "Order History",
        icon: FilePlus,
        children: [
            { title: "Order List", url: "/admin/order-list", index: true },
        ],
    },
    {
        title: "Vendors",
        icon: Store,
        children: [
            { title: "All Vendors", url: "/admin/vendor-list", index: true },
            { title: "Applications", url: "/admin/vendor-applications" },
        ],
    },
    {
        title: "Moderation",
        url: "/admin/product-moderation",
        icon: BadgeCheck,
    },
    {
        title: "Money",
        icon: Banknote,
        children: [
            { title: "Payouts Outstanding", url: "/admin/payouts", index: true },
            { title: "Payout History", url: "/admin/payout-history" },
            // Refunds go out automatically; this is the failure queue.
            { title: "Refunds", url: "/admin/refunds" },
        ],
    },
    {
        title: "User Management",
        url: "/admin/user-management",
        icon: User2,
    },
    {
        title: "Featured Products",
        url: "/admin/featured-products",
        icon: Feather,
    },
    { title: "Reviews", url: "/admin/reviews", icon: Star },
    { title: "Hot Offers", url: "/admin/hot-offers", icon: Coffee },
    { title: "Home", url: "/", icon: Home },
];

export const customerDashboardLinks: TSidebarLink[] = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Cart", url: "/cart", icon: ShoppingCart },
    { title: "My Orders", url: "/dashboard/my-orders", icon: ScrollText },
    { title: "My Reviews", url: "/dashboard/my-reviews", icon: Stars },
    { title: "Address", url: "/dashboard/address", icon: MapPinHouse },
    { title: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
    { title: "Change Password", url: "/dashboard/change-password", icon: Key },
    // The way a shopper becomes a seller. /vendor/apply is deliberately
    // reachable by a CUSTOMER — see src/middleware.ts.
    { title: "Sell on Trendora", url: "/vendor/apply", icon: Store },
    { title: "Home", url: "/", icon: Home },
];

/**
 * The seller area. A vendor is still a shopper, so their own cart, orders and
 * wishlist stay reachable from here too.
 */
export const vendorDashboardLinks: TSidebarLink[] = [
    { title: "Dashboard", url: "/vendor", icon: LayoutDashboard },
    {
        title: "Products",
        icon: ShoppingCart,
        children: [
            { title: "My Products", url: "/vendor/products", index: true },
            { title: "Add Product", url: "/vendor/products/add" },
        ],
    },
    { title: "Orders", url: "/vendor/orders", icon: ScrollText },
    { title: "Payouts", url: "/vendor/payouts", icon: Banknote },
    { title: "Store Settings", url: "/vendor/settings", icon: Settings },
    { title: "My Orders", url: "/dashboard/my-orders", icon: FilePlus },
    { title: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
    { title: "Change Password", url: "/dashboard/change-password", icon: Key },
    { title: "Home", url: "/", icon: Home },
];
