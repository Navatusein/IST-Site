import {IBasePageComponent} from "@/entities/base-page-component";
import {Document} from "mongoose";

export interface ICustomPage extends Document {
  path: string;
  title: string;
  components: IBasePageComponent[];
}