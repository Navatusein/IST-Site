import {headers} from "next/headers";

function getTrustedProxyCount(): number {
  const value = process.env.TRUSTED_PROXY_COUNT?.trim();
  const count = value ? Number(value) : NaN;
  return Number.isInteger(count) && count >= 0 ? count : 1;
}

export async function getClientIp(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for")?.split(",").map((x) => x.trim()).filter(Boolean) ?? [];
  const trustedProxies = getTrustedProxyCount();

  if (trustedProxies == 0)
    return forwarded.at(-1) ?? "unknown";

  return forwarded[forwarded.length - trustedProxies] ?? forwarded[0] ?? "unknown";
}
