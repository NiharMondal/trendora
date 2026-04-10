import { authOptions } from "@/lib/authOptions";
import { useAppSelector } from "@/redux/redux.hooks";
import { RootState } from "@/redux/store";
import { getServerSession } from "next-auth";

export const useUserInfoClient = () => {
    const { user } = useAppSelector((state: RootState) => state.auth);
    if (!user) return null;
    return user;
};

export const useUserInfoServer = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    return session.user;
};
