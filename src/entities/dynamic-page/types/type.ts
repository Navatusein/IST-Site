import {IBasePageComponent} from "@/entities/base-page-component";
import {Document} from "mongoose";

export interface IDynamicPage extends Document {
  name: string;
  title: string;
  path: string;
  components: IBasePageComponent[];
}