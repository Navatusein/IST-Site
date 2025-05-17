"use server"

import {signOut} from "@/auth";
import {createServerAction} from "@/shared/utilities/create-server-action";

export const actionSignOut = createServerAction<void>(async () => {
  return await signOut({
    redirectTo: "/home"
  });
});