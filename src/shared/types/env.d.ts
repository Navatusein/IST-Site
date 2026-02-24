declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;

    APP_PUBLIC_URL: string;
    APP_SECRET: string;

    DEV_ORIGINS?: string;

    ADMIN_LOGIN: string;
    ADMIN_PASSWORD: string;

    MAIL_HOST: string;
    MAIL_PORT: number;
    MAIL_USERNAME: string;
    MAIL_PASSWORD: string;
  }
}