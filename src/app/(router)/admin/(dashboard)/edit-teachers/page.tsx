import {useServerAction} from "@/shared/hooks/use-server-action";
import {getTeachersAction} from "@/entities/teacher/actions/actions";
import {AdminTeachersControlView} from "@/views/admin-teachers-control";


export default async function Page() {
  const teachers = await useServerAction(getTeachersAction());

  return (
    <>
      <AdminTeachersControlView teachers={teachers}/>
    </>
  )
}