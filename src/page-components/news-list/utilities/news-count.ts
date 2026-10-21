import {clampInteger} from "@/shared/utilities/public-input";

export const MIN_NEWS_COUNT = 1;
export const MAX_NEWS_COUNT = 50;

export function getNewsCountDisplayed(value: unknown): number {
  return clampInteger(value, MIN_NEWS_COUNT, MAX_NEWS_COUNT, 10);
}
