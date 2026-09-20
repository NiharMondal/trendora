import { TBrand } from "@/features/brands/types/brand.types";
import { TCategory } from "@/features/categories/types/category.types";
import { TVendorCard } from "@/features/vendors/types/vendor.types";

/**
 * Admin moderation state, independent of the vendor's own `isPublished`
 * switch. A listing is only on the storefront when it is APPROVED *and*
 * published *and* its store is approved.
 */
export type TProductModerationStatus =
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

export type TProductVariant = {
    id: string;
    productId: string;
    sizeId: string;
    color: string;
    stock: number;
    price: string;
    size:{
        id: string;
        name: string;
    }
    isDeleted: boolean;
};

export type TProductImage = {
    id: string;
    productId: string;
    url: string;
    publicId: string;
    altText?: string;
    isMain: boolean;
    isDeleted: boolean;
};
export type TProduct = {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: string;
    gender: string;
    discountPrice: string | null;
    stockQuantity: number;
    isPublished: boolean;
    isFeatured: boolean;
    /** Admin moderation state — see TProductModerationStatus. */
    status: TProductModerationStatus;
    rejectionReason?: string | null;
    submittedAt?: string | null;
    approvedAt?: string | null;
    totalReviews?: number;
    categoryId: string;
    /** The owning store. Every product belongs to exactly one. */
    vendorId: string;
    vendor?: TVendorCard;
    averageRating: number | null;
    brandId: string;
    isDeleted: boolean;
    variants: TProductVariant[];
    images: TProductImage[];
    category?: TCategory;
    brand?: TBrand;
    createdAt: string;
    updatedAt: string;
};

// Product details common file type
export type TVariantInfo = {
    id: null | string;
    price: null | string;
};
