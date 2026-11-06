export type TSlide = {
    id: string;
    title: string;
    subtitle: string;
    photoUrl: string;
    /** Null for an image hosted outside Cloudinary (the seeded banners). */
    photoPublicId: string | null;
    /** Where the slide's button goes — a storefront path or a full URL. */
    url: string;
    /** Display order, ascending. */
    sortOrder: number;
    /** `false` hides it from the storefront; it stays in the admin list. */
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};
