import {
    Coffee,
    Feather,
    FilePlus,
    Heart,
    Home,
    Key,
    Layers,
    MapPinHouse,
    ScrollText,
    ShoppingCart,
    Star,
    User2,
    UserRoundPen,
    type LucideIcon,
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
            { title: "Product List", url: "/admin/product-list", index: true },
            { title: "Add Product", url: "/admin/add-product" },
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
        title: "Order History",
        icon: FilePlus,
        children: [
            { title: "Order List", url: "/admin/order-list", index: true },
            { title: "Order Details", url: "/admin/order-details/" },
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
];

export const customerNavlink: TSidebarLink[] = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "My Orders", url: "/dashboard/my-orders", icon: ScrollText },

    { title: "Address", url: "/dashboard/address", icon: MapPinHouse },
    { title: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
    { title: "Change Password", url: "/dashboard/change-password", icon: Key },
    {
        title: "Edit Account",
        url: "/dashboard/edit-account",
        icon: UserRoundPen,
    },
];
