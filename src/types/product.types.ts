import { TBrand } from "./brand.types";
import { TCategory } from "./category.types";

export type TProductVariant = {
    id: string;
    productId: string;
    size: string;
    color: string;
    stock: number;
    price: string;
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
    discountPrice: string | null;
    stockQuantity: number;
    isPublished: boolean;
    isFeatured: boolean;
    categoryId: string;
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
