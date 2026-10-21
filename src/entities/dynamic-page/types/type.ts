import {Document} from "mongoose";

export type PageEntityWidth = "large"|"medium"|"small";
export type PageEntityType = "component"|"group";

export interface IPageEntity {
  id: string;
  type: PageEntityType;
  width: PageEntityWidth;
}

export type PageGroupColumnSpan = "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1";

export interface IBasePageComponent extends IPageEntity {
  type: "component";
  componentType: string;
  columnSpan?: PageGroupColumnSpan;
}

export type PageGroupVerticalAlign = "top" | "center";

export interface IPageComponentGroup extends IPageEntity {
  type: "group";
  components: IBasePageComponent[];
  verticalAlign?: PageGroupVerticalAlign;
  cards?: boolean;
}

export const MAX_PAGE_GROUP_COMPONENTS = 12;

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
  verticalAlign: "top",
  cards: false
}