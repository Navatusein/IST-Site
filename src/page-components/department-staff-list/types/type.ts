import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IDepartmentStaffListPageComponent extends IBasePageComponent {
  allowedWidth: ["medium"];
}

export const DepartmentStaffListComponentExample = {
  name: "Список співробітників",
  component: {
    type: "department-staff-list",
    allowedWidth: ["medium"],
    width: "medium"
  } as IDepartmentStaffListPageComponent
}