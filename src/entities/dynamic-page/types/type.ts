import {Document} from "mongoose";
import {PageComponentType} from "@/page-components";

export type PageComponentWidth = "large"|"medium"|"small";

export interface IBasePageComponent {
  id: string;
  type: PageComponentType;
  width: PageComponentWidth;
  allowedWidth?: PageComponentWidth[];
}

export interface IDynamicPage extends Document {
  name: string;
  title: string;
  path: string;
  components: IBasePageComponent[];
}

export interface IPageComponentExample {
  name: string;
  component: IBasePageComponent;
}