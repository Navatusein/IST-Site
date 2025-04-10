import {Document} from "mongoose";

export type PageComponentType = "text"

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