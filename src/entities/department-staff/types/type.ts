import {Document} from "mongoose";
import {IPageEntity} from "@/entities/dynamic-page";

export interface IDepartmentStaffProfile {
  title: string;
  url: string;
}

export interface IDepartmentStaff extends Document {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  position: string;
  imagePath?: string;
  path: string,
  entities: IPageEntity[];
  profiles: IDepartmentStaffProfile[];
}