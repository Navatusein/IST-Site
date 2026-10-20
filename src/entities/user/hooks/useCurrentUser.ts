import {useContext} from "react";
import {CurrentUserContext} from "../context/current-user-context";

export const useCurrentUser = () => {
  return useContext(CurrentUserContext);
}
