export const PAGE_ENTITY_ELEMENT_ID_PREFIX = "page-entity-";

export function getPageEntityElementId(entityId: string): string {
  return PAGE_ENTITY_ELEMENT_ID_PREFIX + entityId;
}

export function getPageEntityIdFromElementId(elementId: string): string | null {
  return elementId.startsWith(PAGE_ENTITY_ELEMENT_ID_PREFIX) ? elementId.slice(PAGE_ENTITY_ELEMENT_ID_PREFIX.length) : null;
}

export function scrollToPageEntity(entityId: string): void {
  document.getElementById(getPageEntityElementId(entityId))?.scrollIntoView({behavior: "smooth", block: "start"});
}
