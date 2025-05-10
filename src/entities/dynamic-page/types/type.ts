import {Document} from "mongoose";

export type PageComponentType = "text"|"hero-section"|"news-list"|"title";

export interface IBasePageComponent {
  id: string;
  type: PageComponentType;
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