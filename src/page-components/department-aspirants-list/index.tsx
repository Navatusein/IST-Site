import DepartmentAspirantList from "./ui/department-aspirant-list/department-aspirant-list";
import {IDepartmentAspirantListData, IDepartmentAspirantListPageComponent} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import {getDepartmentAspirantListDataAction} from "./actions/actions";

export type {IDepartmentAspirantListPageComponent, IDepartmentAspirantListData};

export const departmentAspirantListPageComponent = definePageComponent<IDepartmentAspirantListPageComponent, IDepartmentAspirantListData>({
  type: "department-aspirant-list",
  name: "Список аспірантів",
  category: "specific",
  allowedWidth: ["medium"],
  defaults: {
    width: "medium"
  },
  View: DepartmentAspirantList,
  loadData: () => getDepartmentAspirantListDataAction()
});
