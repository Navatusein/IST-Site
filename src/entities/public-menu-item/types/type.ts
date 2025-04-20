import {Document} from "mongoose";

export interface IPublicMenuItem extends Document {
  label: string;
  parent: string;
  path?: string;
  index: number;
  children: IPublicMenuItem[];
}