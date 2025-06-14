import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IDepartmentStaffListPageComponent extends IBasePageComponent {

}

export const DepartmentStaffListComponentExample = {
  name: "Список співробітників",
  component: {
    type: "department-staff-list",

  } as IDepartmentStaffListPageComponent
}