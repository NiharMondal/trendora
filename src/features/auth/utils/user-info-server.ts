import { getServerSession } from "next-auth";

import { authOptions } from "@/features/auth/lib/auth-options";

/**
 * The signed-in user, for SERVER code (server components, route handlers).
 *
 * Split from `user-info.ts` on purpose: `authOptions` reads secrets that do
 * not exist in the browser, so it must never share a module with a client
 * hook. Adding the `server-only` package would turn a stray client import into
 * a build error; it is not installed yet.
 */
export const getUserInfoServer = async () => {
    const session = await getServerSession(authOptions);
    return session?.user ?? null;
};
