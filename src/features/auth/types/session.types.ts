export type TSessionResponse = {
    user: TUserSession;
    expires: string;
    accessToken: string;
};

export type TUserSession = {
    name: string;
    email: string;
    id: string;
    role: string;
    image: string;
};
