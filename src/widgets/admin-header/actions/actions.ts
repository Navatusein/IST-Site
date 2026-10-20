"use server"

import {invalidateCurrentSession} from "@/auth";
import {createServerAction} from "@/shared/utilities/create-server-action";

export const actionSignOut = createServerAction<void>(async () => {
  await invalidateCurrentSession();
});
