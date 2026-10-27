import {IPageEntity} from "@/entities/dynamic-page";

// Blocks are not known here, so any `imageSlug` / `imageSlugs` field counts
export function getPageImageSlug(entities: IPageEntity[]): string | undefined {
  const find = (value: unknown): string | undefined => {
    if (Array.isArray(value)) {
      for (const item of value) {
        const slug = find(item);

        if (slug)
          return slug;
      }

      return undefined;
    }

    if (value == null || typeof value != "object")
      return undefined;

    const record = value as Record<string, unknown>;

    if (typeof record.imageSlug == "string" && record.imageSlug)
      return record.imageSlug;

    if (Array.isArray(record.imageSlugs) && typeof record.imageSlugs[0] == "string")
      return record.imageSlugs[0];

    for (const child of Object.values(record)) {
      const slug = find(child);

      if (slug)
        return slug;
    }

    return undefined;
  };

  return find(entities);
}
