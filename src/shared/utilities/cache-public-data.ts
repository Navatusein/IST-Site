import {unstable_cache} from "next/cache";

export const PUBLIC_DATA_TAG = "public-data";

export function cachePublicData<A extends unknown[], T>(key: string, callback: (...args: A) => Promise<T>): (...args: A) => Promise<T> {
  return unstable_cache(callback, [key], {tags: [PUBLIC_DATA_TAG], revalidate: 86400});
}
