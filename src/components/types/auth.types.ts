export type TAuthRegisterResponse = {
    id: string;
    name: string;
    email: string;
    phone: any;
    role: string;
    createdAt: string;
    updatedAt: string;
}


export type TAuthLoginResponse = {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    }
}