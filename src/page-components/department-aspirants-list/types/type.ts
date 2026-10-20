import {IBasePageComponent} from "@/entities/dynamic-page";
import {IDepartmentAspirant} from "@/entities/department-aspirant";

export interface IDepartmentAspirantListPageComponent extends IBasePageComponent {
  componentType: "department-aspirant-list";
}

export interface IDepartmentAspirantListData {
  aspirants: IDepartmentAspirant[];
  graduates: IDepartmentAspirant[];
  staffNames: Record<string, string>;
}
