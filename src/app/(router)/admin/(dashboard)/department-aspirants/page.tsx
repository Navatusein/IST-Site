import {useServerAction} from "@/shared/hooks/use-server-action";
import {getDepartmentStaffAction} from "@/entities/department-staff/actions/actions";
import {AdminDepartmentAspirantCrudView} from "@/views/admin-department-aspirant-crud";
import {getDepartmentAspirantAction} from "@/entities/department-aspirant/actions/actions";


export default async function Page() {
  const departmentStaff = await useServerAction(getDepartmentStaffAction());
  const departmentAspirants = await useServerAction(getDepartmentAspirantAction());

  return (
    <>
      <AdminDepartmentAspirantCrudView departmentStaff={departmentStaff} departmentAspirants={departmentAspirants}/>
    </>
  )
}