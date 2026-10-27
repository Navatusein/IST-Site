const FILE_VIEW_LINK = /\/file\/([a-z0-9]{10})(?![a-z0-9])/g;

// Blocks are not known here: file links are `{linkType: "file", link}` objects or /file/<slug> inside rich text JSON
export function findFileSlugs(value: unknown, slugs = new Set<string>()): Set<string> {
  if (typeof value == "string") {
    for (const match of value.matchAll(FILE_VIEW_LINK))
      slugs.add(match[1]);
  }
  else if (Array.isArray(value)) {
    value.forEach((item) => findFileSlugs(item, slugs));
  }
  else if (value != null && typeof value == "object") {
    const record = value as Record<string, unknown>;

    if (record.linkType == "file" && typeof record.link == "string" && record.link)
      slugs.add(record.link);

    Object.values(record).forEach((item) => findFileSlugs(item, slugs));
  }

  return slugs;
}
