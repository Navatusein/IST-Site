declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    NEXT_PUBLIC_BASE_URL: string;
    SECRET: string;
    ALLOWED_DEV_ORIGINS?: string;
  }
}