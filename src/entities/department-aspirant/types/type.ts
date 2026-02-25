import {Document} from "mongoose";
import {ObjectId} from "bson";

export interface IDepartmentAspirant extends Document {
  firstName: string;
  lastName: string;
  middleName: string;
  thesisHeadId: ObjectId;
  thesisTheme: string;
  thesisDate?: Date;
  imagePath?: string;
}