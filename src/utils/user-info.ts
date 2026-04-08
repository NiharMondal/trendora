import { useAppSelector } from "@/redux/redux.hooks";

export const getUserInfoFromCookies = () => {
    const { user } = useAppSelector((state) => state.auth);
    return user;
}

export const getUserRoleFromCookies = () => {
    const { user } = useAppSelector((state) => state.auth);
    return user?.role;
}