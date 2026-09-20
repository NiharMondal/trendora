import { EnumUserRole } from "@/features/auth/constants/user-role";

/**
 * Where a signed-in user belongs.
 *
 * This used to be an `if (ADMIN || SUPER_ADMIN) "/admin" else "/dashboard"`
 * ternary copy-pasted into the middleware, `AuthSync`, the login form and the
 * login page. Adding a third role to four copies is how one of them gets
 * missed, so the decision lives here.
 */
export const roleHomePath = (role?: string | null): string => {
    switch (role) {
        case EnumUserRole.ADMIN:
        case EnumUserRole.SUPER_ADMIN:
            return "/admin";
        case EnumUserRole.VENDOR:
            return "/vendor";
        default:
            return "/dashboard";
    }
};

export const isAdminRole = (role?: string | null): boolean =>
    role === EnumUserRole.ADMIN || role === EnumUserRole.SUPER_ADMIN;

/**
 * A vendor reaches the seller area; an admin is allowed in too so they can
 * support a store without a second login.
 */
export const isVendorRole = (role?: string | null): boolean =>
    role === EnumUserRole.VENDOR || isAdminRole(role);

/**
 * Everyone signed in is also a shopper — a VENDOR still has a cart, addresses
 * and orders of their own, so buyer-facing areas must not be admin/customer
 * only.
 */
export const isShopperRole = (role?: string | null): boolean =>
    role === EnumUserRole.CUSTOMER ||
    role === EnumUserRole.VENDOR ||
    isAdminRole(role);
