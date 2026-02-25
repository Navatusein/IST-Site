import {useServerAction} from "@/shared/hooks/use-server-action";
import {getDepartmentStaffAction} from "@/entities/department-staff/actions/actions";
import {AdminDepartmentStaffCrudView} from "@/views/admin-department-staff-crud";


export default async function Page() {
  const departmentStaff = await useServerAction(getDepartmentStaffAction());

  return (
    <>
      <AdminDepartmentStaffCrudView departmentStaff={departmentStaff}/>
    </>
  )
}