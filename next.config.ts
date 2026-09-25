import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            // `/wish-list` rendered a heading over an empty grid whatever the
            // shopper had saved (FE-20). The real wishlist is in the dashboard;
            // this keeps old links and bookmarks working. Done here rather than
            // with `permanentRedirect()` in a page: that route prerenders as
            // static, so a render-time redirect is sent as a 200 with a
            // client-side hop instead of a real 308.
            {
                source: "/wish-list",
                destination: "/dashboard/wishlist",
                permanent: true,
            },
            // Featuring is a per-row action in the product table now; the
            // old standalone screen became the Products → Featured tab.
            {
                source: "/admin/featured-products",
                destination: "/admin/product-list/featured",
                permanent: true,
            },
        ];
    },
    images: {
        remotePatterns: [{ hostname: "*", protocol: "https" }],
    },
};

export default nextConfig;
