import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import { authOptions } from "@/features/auth/lib/auth-options";

export const useUserInfoClient = () => {
    const { data: session } = useSession();
    return session?.user ?? null;
};

export const useUserInfoServer = async () => {
    const session = await getServerSession(authOptions);
    return session?.user ?? null;
};
