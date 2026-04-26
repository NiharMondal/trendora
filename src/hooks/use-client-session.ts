import { TSessionResponse } from "@/components/types/session.types";
import { useSession } from "next-auth/react";

export const useClientSession = () => {
    const { data: session } = useSession();
    return session as TSessionResponse;
};
