import {AdminUsersControlView} from "@/views/admin-users-control";
import {getUsersAction} from "@/entities/user/actions/actions";

export default async function Page() {
  const users = await getUsersAction();

  return (
    <>
      <AdminUsersControlView users={users}/>
    </>
  )
}