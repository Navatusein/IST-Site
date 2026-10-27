export function getPublicOrigin(): string {
  return (process.env.APP_PUBLIC_URL ?? "").replace(/\/+$/, "");
}
