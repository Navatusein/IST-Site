import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {getUserByIdAction} from "@/entities/user/actions/actions";
import {useServerAction} from "@/shared/hooks/use-server-action";

export const useUserPermissions = () => {
  const session = useSession();

  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    if (session.status === "loading" || session.status === "unauthenticated") {
      setUserPermissions(() => []);
      setIsAuthorized(() => false);
      return;
    }

    if (session.data?.user == null) {
      setUserPermissions(() => []);
      setIsAuthorized(() => false);
      return;
    }

    useServerAction(getUserByIdAction(session.data.user.id))
      .then((user) => {
        setUserPermissions(() => user?.permissions ?? []);
        setIsAuthorized(() => true);
      })
  }, [session.status, session.data]);

  return {isAuthorized, userPermissions};
}