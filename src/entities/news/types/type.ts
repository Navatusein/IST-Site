import {Document} from "mongoose";
import type {IPageEntity} from "@/entities/dynamic-page/@x/news";

export interface INews extends Document {
  title: string;
  description: string;
  imageSlug?: string;
  path: string;
  entities: IPageEntity[];
  date: string;
}