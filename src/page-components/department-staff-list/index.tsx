import DepartmentStaffList from "./ui/department-staff-list/department-staff-list";
import {DepartmentStaffListData, IDepartmentStaffListPageComponent} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import {getDepartmentStaffAction} from "@/entities/department-staff/actions/actions";

export type {IDepartmentStaffListPageComponent, DepartmentStaffListData};

export const departmentStaffListPageComponent = definePageComponent<IDepartmentStaffListPageComponent, DepartmentStaffListData>({
  type: "department-staff-list",
  name: "Список співробітників",
  category: "specific",
  allowedWidth: ["medium"],
  defaults: {
    width: "medium"
  },
  View: DepartmentStaffList,
  loadData: () => getDepartmentStaffAction()
});
