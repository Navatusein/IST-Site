import {useServerAction} from "@/shared/hooks/use-server-action";
import {getDepartmentStaffAction} from "@/entities/department-staff/actions/actions";
import {AdminDepartmentStaffControlView} from "@/views/admin-department-staff-control";


export default async function Page() {
  const teachers = await useServerAction(getDepartmentStaffAction());

  return (
    <>
      <AdminDepartmentStaffControlView teachers={teachers}/>
    </>
  )
}