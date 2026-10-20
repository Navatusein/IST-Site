import {Document} from "mongoose";
import type {IPageEntity} from "@/entities/dynamic-page/@x/department-staff";

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
  imageSlug?: string;
  path: string,
  entities: IPageEntity[];
  profiles: IDepartmentStaffProfile[];
}