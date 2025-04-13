import {Document} from "mongoose";
import {IBasePageComponent} from "@/entities/dynamic-page";

export interface INews extends Document {
  title: string;
  description: string;
  image: string;
  path: string;
  components: IBasePageComponent[];
}