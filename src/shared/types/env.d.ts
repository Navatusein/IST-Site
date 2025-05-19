declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    NEXT_PUBLIC_BASE_URL: string;
    SECRET: string;
    ALLOWED_DEV_ORIGINS?: string;
    MAIL_HOST: string;
    MAIL_PORT: number;
    MAIL_USERNAME: string;
    MAIL_PASSWORD: string;
  }
}