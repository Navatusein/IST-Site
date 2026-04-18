import {Document} from "mongoose";
import {IPageEntity} from "@/entities/dynamic-page";

export interface INews extends Document {
  title: string;
  description: string;
  imagePath: string;
  path: string;
  entities: IPageEntity[];
  date: string;
}