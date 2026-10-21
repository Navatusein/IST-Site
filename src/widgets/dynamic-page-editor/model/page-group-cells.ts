import {IBasePageComponent, PageGroupColumnSpan} from "@/entities/dynamic-page";

export function getNewCellSpan(components: IBasePageComponent[]): PageGroupColumnSpan {
  return components.at(-1)?.columnSpan ?? "1/2";
}

export function toGroupCell(component: IBasePageComponent, components: IBasePageComponent[]): IBasePageComponent {
  return {...component, columnSpan: component.columnSpan ?? getNewCellSpan(components)};
}

export function fromGroupCell(component: IBasePageComponent): IBasePageComponent {
  const {columnSpan: _, ...rest} = component;
  return rest;
}
