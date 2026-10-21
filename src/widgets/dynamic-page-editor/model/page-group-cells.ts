import {IBasePageComponent, PageGroupColumnSpan} from "@/entities/dynamic-page";

// A block added to a group takes the width of the last one, so a line of cards keeps its look
export function getNewCellSpan(components: IBasePageComponent[]): PageGroupColumnSpan {
  return components.at(-1)?.columnSpan ?? "1/2";
}

export function toGroupCell(component: IBasePageComponent, components: IBasePageComponent[]): IBasePageComponent {
  return {...component, columnSpan: component.columnSpan ?? getNewCellSpan(components)};
}

// A block taken out of a group no longer needs its width in the layout
export function fromGroupCell(component: IBasePageComponent): IBasePageComponent {
  const {columnSpan: _, ...rest} = component;
  return rest;
}
