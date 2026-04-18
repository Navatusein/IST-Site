import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IDepartmentStaffListPageComponent extends IBasePageComponent {
  allowedWidth: ["medium"];
}

export const DepartmentStaffListComponentExample = {
  name: "Список співробітників",
  component: {
    type: "component",
    componentType: "department-staff-list",
    allowedWidth: ["medium"],
    width: "medium"
  } as IDepartmentStaffListPageComponent
}