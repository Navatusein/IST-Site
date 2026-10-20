export function isPublicPath(value: unknown): value is string {
  return typeof value == "string" && value.length != 0 && value.length <= 300;
}

export function clampInteger(value: unknown, min: number, max: number, fallback: number): number {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}
