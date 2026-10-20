import {headers} from "next/headers";

export async function getClientIp(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for")?.split(",").map((x) => x.trim()).filter(Boolean) ?? [];
  const trustedProxies = Math.max(1, Number(process.env.TRUSTED_PROXY_COUNT) || 1);

  return forwarded[forwarded.length - trustedProxies] ?? forwarded[0] ?? "unknown";
}
