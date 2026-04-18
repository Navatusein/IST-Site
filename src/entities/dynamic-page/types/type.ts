import {Document} from "mongoose";
import {PageComponentType} from "@/page-components";

export type PageEntityWidth = "large"|"medium"|"small";
export type PageEntityType = "component"|"group";

export interface IPageEntity {
  id: string;
  type: PageEntityType;
  width: PageEntityWidth;
}

export interface IBasePageComponent extends IPageEntity {
  type: "component";
  componentType: PageComponentType;
  allowedWidth?: PageEntityWidth[];
}

export interface IPageComponentGroup extends IPageEntity {
  type: "group";
  components: IBasePageComponent[];
}

export interface IDynamicPage extends Document {
  name: string;
  title: string;
  path: string;
  entities: IPageEntity[];
}

export interface IPageComponentExample {
  name: string;
  component: IBasePageComponent;
}

export const EmptyPageComponentGroup: IPageComponentGroup = {
  id: "",
  type: "group",
  width: "medium",
  components: []
}