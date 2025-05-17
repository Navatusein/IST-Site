"use server"

import {signIn} from "@/auth";
import {CouldNotParseError, InvalidPasswordError} from "@/shared/types/next-auth-exceptions";
import {createServerAction} from "@/shared/utilities/create-server-action";

export const actionSignIn = createServerAction<string | undefined>(async (login: string, password: string) => {
  try {
    return await signIn("credentials", {
      login,
      password,
      redirectTo: "/admin",
      redirect: false
    });
  } catch (error) {
    if (error instanceof InvalidPasswordError)
      return "InvalidPasswordError";

    if (error instanceof CouldNotParseError)
      return "CouldNotParseError";

    return "Undefined";
  }
});