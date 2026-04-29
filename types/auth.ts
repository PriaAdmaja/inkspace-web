export type LoginResponse = {
    accessToken: string;
    user: {
        id: string;
        username: string;
        email: string;
        avatar?: string;
        about?: string;
    }
}