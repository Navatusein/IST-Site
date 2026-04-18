import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IDepartmentAspirantListPageComponent extends IBasePageComponent {
  allowedWidth: ["medium"];
}

export const DepartmentAspirantListComponentExample = {
  name: "Список аспірантів",
  component: {
    type: "component",
    componentType: "department-aspirant-list",
    allowedWidth: ["medium"],
    width: "medium"
  } as IDepartmentAspirantListPageComponent
}