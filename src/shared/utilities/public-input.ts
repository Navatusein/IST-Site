const PUBLIC_PATH_PATTERN = /^[\p{L}\p{N}_.~-]+(\/[\p{L}\p{N}_.~-]+)*$/u;

export function isPublicPath(value: unknown): value is string {
  return typeof value == "string" && value.length != 0 && value.length <= 300 && PUBLIC_PATH_PATTERN.test(value);
}

export function clampInteger(value: unknown, min: number, max: number, fallback: number): number {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}
