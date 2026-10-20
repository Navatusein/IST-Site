import {Document} from "mongoose";

export type PageEntityWidth = "large"|"medium"|"small";
export type PageEntityType = "component"|"group";

export interface IPageEntity {
  id: string;
  type: PageEntityType;
  width: PageEntityWidth;
}

export interface IBasePageComponent extends IPageEntity {
  type: "component";
  componentType: string;
}

export type PageGroupProportions = "equal" | "1:2" | "2:1";
export type PageGroupVerticalAlign = "top" | "center";

export interface IPageComponentGroup extends IPageEntity {
  type: "group";
  components: IBasePageComponent[];
  proportions?: PageGroupProportions;
  verticalAlign?: PageGroupVerticalAlign;
}

export const MAX_PAGE_GROUP_COMPONENTS = 4;

export interface IDynamicPage extends Document {
  name: string;
  title: string;
  description?: string;
  path: string;
  entities: IPageEntity[];
}

export const EmptyPageComponentGroup: IPageComponentGroup = {
  id: "",
  type: "group",
  width: "medium",
  components: [],
  proportions: "equal",
  verticalAlign: "top"
}