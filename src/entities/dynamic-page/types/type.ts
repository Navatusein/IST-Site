import {Document} from "mongoose";

export type PageComponentType = "title"|"markdown-text"|"hero-section-main"|"news-list";

export type PageComponentWidth = "large"|"medium";

export interface IBasePageComponent {
  id: string;
  type: PageComponentType;
  width: PageComponentWidth;
  allowedWidth?: PageComponentWidth;
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