// Search engines may index the site only where this is set (production), so dev and test servers stay out of search
export function isIndexingAllowed(): boolean {
  return process.env.ALLOW_INDEXING == "true";
}

export const NO_INDEX_HEADER = "noindex, nofollow";

export const ROBOTS_HEADER = "X-Robots-Tag";
