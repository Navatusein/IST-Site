import {AdminUsersCrudView} from "@/views/admin-users-crud";
import {getUsersAction} from "@/entities/user/actions/actions";
import {useServerAction} from "@/shared/hooks/use-server-action";

export default async function Page() {
  const users = await useServerAction(getUsersAction());

  return (
    <>
      <AdminUsersCrudView users={users}/>
    </>
  )
}