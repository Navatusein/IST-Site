import {getEntityComponents, IEntityLink} from "./extract-links";

export interface ICodeLinksContext {
  staffPaths: string[];
}

type CodeLinks = (component: any, context: ICodeLinksContext) => string[];

const COMPONENT_CODE_LINKS: Record<string, CodeLinks> = {
  "news-list": (component) => component.pagination ? [] : ["/news"],
  "department-staff-list": (_, context) => context.staffPaths,
};

export function getEntitiesCodeLinks(entities: unknown, context: ICodeLinksContext): IEntityLink[] {
  return getEntityComponents(entities).flatMap((component) => (
    (COMPONENT_CODE_LINKS[component.componentType]?.(component, context) ?? []).map((href) => ({href, componentId: component.id}))
  ));
}
