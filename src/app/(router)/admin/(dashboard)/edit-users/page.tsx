import {AdminUsersControlView} from "@/views/admin-users-control";
import {getUsersAction} from "@/entities/user/actions/actions";
import {useServerAction} from "@/shared/hooks/use-server-action";

export default async function Page() {
  const users = await useServerAction(getUsersAction());

  return (
    <>
      <AdminUsersControlView users={users}/>
    </>
  )
}