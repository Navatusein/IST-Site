import {useCurrentUser} from "./useCurrentUser";

export const useUserPermissions = () => {
  const user = useCurrentUser();

  return {
    isAuthorized: user != null,
    userPermissions: user?.permissions ?? []
  };
}
