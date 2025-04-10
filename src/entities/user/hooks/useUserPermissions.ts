import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {getUserByIdAction} from "@/entities/user/actions/actions";

export const useUserPermissions = () => {
  const session = useSession();

  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    console.log("useUserPermissions update");

    if (session.status === "loading" || session.status === "unauthenticated") {
      setPermissions(() => []);
      return;
    }

    if (session.data?.user == null) {
      setPermissions(() => []);
      return;
    }
    
    getUserByIdAction(session.data.user.id).then((user) => {
      setPermissions(() => user?.permissions ?? []);
    })
  }, [session.status, session.data]);

  return permissions;
}