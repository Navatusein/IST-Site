declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;

    APP_PUBLIC_URL: string;
    TRUSTED_PROXY_COUNT?: string;
    ENABLE_TEST_PAGE?: string;
    ALLOW_INDEXING?: string;
    GA_MEASUREMENT_ID?: string;

    DEV_ORIGINS?: string;

    ADMIN_LOGIN: string;
    ADMIN_PASSWORD: string;

    MAIL_HOST: string;
    MAIL_PORT: number;
    MAIL_USERNAME: string;
    MAIL_PASSWORD: string;
    MAIL_FROM_NAME?: string;

    CONTACT_EMAIL_TO?: string;
  }
}