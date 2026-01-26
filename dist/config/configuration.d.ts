declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string | undefined;
        expiresIn: string;
    };
    google: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
    email: {
        host: string | undefined;
        port: number;
        secure: boolean;
        user: string | undefined;
        password: string | undefined;
        from: string;
    };
    cron: {
        enabled: boolean;
        secret: string | undefined;
    };
    frontend: {
        url: string;
    };
};
export default _default;
