import {IBasePageComponent} from "@/entities/dynamic-page";
import {IDepartmentStaff} from "@/entities/department-staff";

export interface IDepartmentStaffListPageComponent extends IBasePageComponent {
  componentType: "department-staff-list";
}

export type DepartmentStaffListData = IDepartmentStaff[];
