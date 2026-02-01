export type TProductVariant = {
    id: string;
    productId: string;
    size: string;
    color: string;
    stock: number | string;
    price: string;
    isDeleted: boolean;
};

export type TProductImage = {
    id: string;
    productId: string;
    url: string;
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
    rating: number | null;
    brandId: string;
    isDeleted: boolean;
    variants: TProductVariant[];
    images: TProductImage[];
    createdAt: string;
    updatedAt: string;
};

// Product details common file type
export type TVariantInfo = {
    id: null | string;
    price: null | string;
};
