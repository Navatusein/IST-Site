import {unstable_cache} from "next/cache";

export const PUBLIC_DATA_TAG = "public-data";

class PublicDataMissError extends Error {
  constructor() {
    super("Public data not found");
    this.name = "PublicDataMissError";
  }
}

export function cachePublicData<A extends unknown[], T>(key: string, callback: (...args: A) => Promise<T>): (...args: A) => Promise<T> {
  return unstable_cache(callback, [key], {tags: [PUBLIC_DATA_TAG], revalidate: 86400});
}

export function cachePublicRecord<A extends unknown[], T>(key: string, callback: (...args: A) => Promise<T | null>): (...args: A) => Promise<T | null> {
  const cached = cachePublicData(key, async (...args: A): Promise<T> => {
    const record = await callback(...args);

    if (record == null)
      throw new PublicDataMissError();

    return record;
  });

  return async (...args: A) => {
    try {
      return await cached(...args);
    }
    catch (error) {
      if (error instanceof PublicDataMissError || (error as Error)?.name == "PublicDataMissError")
        return null;

      throw error;
    }
  };
}
