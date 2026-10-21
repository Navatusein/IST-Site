export interface IEntityLink {
  href: string;
  componentId?: string;
}

export function getEntityComponents(entities: unknown): any[] {
  if (!Array.isArray(entities))
    return [];

  return entities.flatMap((entity: any) => entity?.type == "group" ? getEntityComponents(entity.components) : entity ? [entity] : []);
}

export function extractEntityLinks(entities: unknown): IEntityLink[] {
  return getEntityComponents(entities).flatMap((component) => (
    extractValueLinks(component).map((href) => ({href, componentId: component.id}))
  ));
}

function extractValueLinks(value: unknown): string[] {
  const hrefs: string[] = [];

  const walkRichText = (node: any) => {
    for (const mark of node?.marks ?? []) {
      if (mark?.type == "link" && typeof mark.attrs?.href == "string")
        hrefs.push(mark.attrs.href);
    }

    for (const child of node?.content ?? [])
      walkRichText(child);
  }

  const walk = (current: unknown) => {
    if (typeof current == "string") {
      if (/^\s*\{\s*"type"\s*:\s*"doc"/.test(current)) {
        try {
          walkRichText(JSON.parse(current));
        }
        catch {
        }
      }

      return;
    }

    if (Array.isArray(current)) {
      current.forEach(walk);
      return;
    }

    if (current == null || typeof current != "object")
      return;

    const object = current as Record<string, unknown>;

    if (typeof object.linkType == "string" && typeof object.link == "string" && (object.linkType == "page" || object.linkType == "link"))
      hrefs.push(object.link);

    if (typeof object.path == "string")
      hrefs.push(object.path);

    for (const [key, child] of Object.entries(object)) {
      if (key != "link" && key != "path")
        walk(child);
    }
  }

  walk(value);

  return hrefs;
}

const NOT_PAGE_PREFIXES = ["/api", "/admin", "/file", "/files", "/sign-in", "/_next"];
const FILE_EXTENSION = /\.[a-z0-9]{1,8}$/i;

export function normalizeSitePath(href: string, publicUrl?: string): string | null {
  let value = href.trim();

  if (/^(https?:)?\/\//i.test(value)) {
    try {
      const url = new URL(value, "https://localhost");

      if (!publicUrl || new URL(publicUrl).host != url.host)
        return null;

      value = url.pathname;
    }
    catch {
      return null;
    }
  }

  if (!value.startsWith("/"))
    return null;

  value = value.split(/[?#]/)[0].replace(/\/+$/, "");

  try {
    value = decodeURI(value);
  }
  catch {
  }

  if (value == "")
    return "/home";

  if (NOT_PAGE_PREFIXES.some((prefix) => value == prefix || value.startsWith(prefix + "/")) || FILE_EXTENSION.test(value))
    return null;

  return value;
}
