import { useSession } from "next-auth/react";

/**
 * The signed-in user, for CLIENT components.
 *
 * This file must not import `auth-options` (directly or through a helper).
 * `auth-options` reads the validated `serverEnv`, whose secrets are undefined
 * in the browser, so pulling it into a client bundle throws on load. That is
 * what took down every page with a product card: `useWishlistToggle` imports
 * this hook. The server-side counterpart is `user-info-server.ts`.
 */
export const useUserInfoClient = () => {
    const { data: session } = useSession();
    return session?.user ?? null;
};
