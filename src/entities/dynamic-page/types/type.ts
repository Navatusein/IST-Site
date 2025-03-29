import {IBasePageComponent} from "@/entities/base-page-component";
import {Document} from "mongoose";

export interface IDynamicPage extends Document {
  path: string;
  title: string;
  components: IBasePageComponent[];
}