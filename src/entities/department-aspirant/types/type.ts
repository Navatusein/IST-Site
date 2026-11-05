import {Document} from "mongoose";
import {ObjectId} from "bson";

export interface IDepartmentAspirant extends Document {
  firstName: string;
  lastName: string;
  middleName: string;
  thesisHeadId?: ObjectId | null;
  // Supervisor who is not on the department staff
  thesisHeadName?: string | null;
  thesisTheme: string;
  thesisDate?: Date;
  imageSlug?: string;
  order?: number;
}