"use server"

import {IDepartmentAspirant} from "@/entities/department-aspirant";
import {IDepartmentStaff} from "@/entities/department-staff";
import DepartmentAspirantModel from "@/entities/department-aspirant/types/schema";
import DepartmentStaffModel from "@/entities/department-staff/types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {cachePublicData} from "@/shared/utilities/cache-public-data";
import {IDepartmentAspirantListData} from "../types/type";

export const getDepartmentAspirantListDataAction = createServerAction<IDepartmentAspirantListData>(cachePublicData("getDepartmentAspirantListDataAction", async () => {
  const [aspirants, staff] = await Promise.all([
    DepartmentAspirantModel.find<IDepartmentAspirant>({}).sort({date: "desc"}),
    DepartmentStaffModel.find<IDepartmentStaff>({})
  ]);

  const plainAspirants = toPlainObject<IDepartmentAspirant[]>(aspirants);

  return {
    aspirants: plainAspirants.filter((x) => x.thesisDate == null),
    graduates: plainAspirants.filter((x) => x.thesisDate != null),
    staffNames: Object.fromEntries(staff.map((value) => (
      [String(value._id), `${value.lastName} ${value.firstName} ${value.middleName}`]
    )))
  };
}));
