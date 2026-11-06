import {
    BadgeCheck,
    Banknote,
    Blend,
    Boxes,
    Feather,
    FilePlus,
    GalleryHorizontal,
    Heart,
    Home,
    Key,
    Layers,
    LayoutDashboard,
    type LucideIcon,
    MapPinHouse,
    ReceiptText,
    Scaling,
    ScrollText,
    Settings,
    ShoppingCart,
    Star,
    Stars,
    Store,
    User2,
} from "lucide-react";

import { EnumUserRole } from "@/features/auth/constants/user-role";

/**
 * A child is NOT a second sidebar row — the sidebar is flat. Children are the
 * tabs rendered at the top of the page by `DashboardTabs`, so a resource owns
 * one sidebar entry ("Brand") and its list/add screens read as two tabs of the
 * same screen while staying two real routes.
 */
type TChildren = {
    title: string;
    url: string;
    /** The tab the sidebar entry links to. Falls back to the first child. */
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
                title: "Size Groups",
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
                title: "Sizes",
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
                title: "Categories",
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
                title: "Brands",
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
            { title: "All Products", url: "/admin/product-list", index: true },
            { title: "Add Product", url: "/admin/add-product" },
        ],
    },
    { title: "Order History", url: "/admin/order-list", icon: FilePlus },
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
            { title: "Outstanding", url: "/admin/payouts", index: true },
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
    {
        title: "Hero Slides",
        icon: GalleryHorizontal,
        children: [
            { title: "Slides", url: "/admin/slide-list", index: true },
            { title: "Add Slide", url: "/admin/add-slide" },
        ],
    },
    { title: "Reviews", url: "/admin/reviews", icon: Star },
    { title: "Home", url: "/", icon: Home },
];

export const customerDashboardLinks: TSidebarLink[] = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Cart", url: "/cart", icon: ShoppingCart },
    { title: "My Orders", url: "/dashboard/my-orders", icon: ScrollText },
    { title: "My Refunds", url: "/dashboard/my-refunds", icon: ReceiptText },
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
    // A seller is a shopper too — these are refunds on orders they PLACED.
    { title: "My Refunds", url: "/dashboard/my-refunds", icon: ReceiptText },
    { title: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
    { title: "Change Password", url: "/dashboard/change-password", icon: Key },
    { title: "Home", url: "/", icon: Home },
];

/** Which sidebar a role gets. Both the sidebar and the page tabs read this. */
export const getDashboardNav = (
    role: EnumUserRole,
): { label: string; navLink: TSidebarLink[] } => {
    switch (role) {
        case EnumUserRole.ADMIN:
        case EnumUserRole.SUPER_ADMIN:
            return { label: "Admin Dashboard", navLink: adminDashboardLinks };
        case EnumUserRole.VENDOR:
            return { label: "Seller Dashboard", navLink: vendorDashboardLinks };
        default:
            return {
                label: "Customer Dashboard",
                navLink: customerDashboardLinks,
            };
    }
};

/** The route a sidebar row points at — its own url, or its index tab. */
export const navLinkUrl = (nav: TSidebarLink): string =>
    nav.url ?? nav.children?.find((child) => child.index)?.url ?? nav.children?.[0]?.url ?? "#";

/** Every route a sidebar row owns, for deciding which row is highlighted. */
export const navLinkPaths = (nav: TSidebarLink): string[] =>
    nav.children?.length
        ? nav.children.map((child) => child.url)
        : nav.url
          ? [nav.url]
          : [];
