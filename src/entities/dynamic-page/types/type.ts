import {Document} from "mongoose";

export type PageComponentType = "text"|"hero-section"|"news-list"|"title";

export type PageComponentWidth = "large"|"medium";

export interface IBasePageComponent {
  id: string;
  type: PageComponentType;
  width: PageComponentWidth;
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