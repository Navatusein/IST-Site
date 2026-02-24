import {Document} from "mongoose";
import {ObjectId} from "bson";

export interface IPublicMenuItem extends Document {
  label: string;
  parent: ObjectId;
  path?: string;
  index: number;
  children: IPublicMenuItem[];
}