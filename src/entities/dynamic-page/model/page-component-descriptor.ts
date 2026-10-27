import {ComponentType} from "react";
import {IServerActionResult} from "@/shared/types/server-action-result";
import {IBasePageComponent, PageEntityWidth} from "../types/type";

export type PageComponentCategoryName = "universal" | "specific";

export interface IPageComponentViewProps<T extends IBasePageComponent, D = undefined> {
  component: T;
  data?: D;
}

export interface IPageComponentEditorProps<T extends IBasePageComponent> {
  component: T;
  onChange: (value: T) => void;
}

export interface IPageComponentDescriptor<T extends IBasePageComponent = IBasePageComponent, D = undefined> {
  type: T["componentType"];
  name: string;
  category: PageComponentCategoryName;
  allowedWidth?: PageEntityWidth[];
  allowInRow?: boolean;
  defaults: Omit<T, "id" | "type" | "componentType">;
  View: ComponentType<IPageComponentViewProps<T, D>>;
  Editor?: ComponentType<IPageComponentEditorProps<T>>;
  loadData?: (component: T) => Promise<IServerActionResult<D>>;
  // Texts of the h1 headings the block renders
  getMainHeadings?: (component: T) => string[];
}

export type AnyPageComponentDescriptor = IPageComponentDescriptor<any, any>;

export function definePageComponent<T extends IBasePageComponent, D = undefined>(
  descriptor: IPageComponentDescriptor<T, D>
): IPageComponentDescriptor<T, D> {
  return descriptor;
}

export function createPageComponent(descriptor: AnyPageComponentDescriptor): IBasePageComponent {
  return {
    ...structuredClone(descriptor.defaults),
    id: "",
    type: "component",
    componentType: descriptor.type
  } as IBasePageComponent;
}

export interface IPageComponentCategory {
  name: PageComponentCategoryName;
  title: string;
  description: string;
}

export type PageComponentsData = Record<string, unknown>;
