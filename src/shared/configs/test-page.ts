export const TEST_PAGE_PATH = "/test";

export function isTestPageEnabled(): boolean {
  return process.env.NODE_ENV == "development" || process.env.ENABLE_TEST_PAGE == "true";
}
