import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "../types/type";
import type {IPageComponentRegistry} from "./page-component-registry";

export interface IPageMainHeading {
  componentId: string;
  text: string;
}

export function getPageMainHeadings(entities: IPageEntity[], registry: IPageComponentRegistry): IPageMainHeading[] {
  const components = entities.flatMap((entity) => (
    entity.type == "group" ? (entity as IPageComponentGroup).components : [entity as IBasePageComponent]
  ));

  return components.flatMap((component) => {
    const descriptor = registry.getDescriptor(component.componentType);

    return (descriptor?.getMainHeadings?.(component) ?? []).map((text) => ({componentId: component.id, text}));
  });
}
