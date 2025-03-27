"use server"

import {signIn} from "@/auth";
import {CouldNotParseError, InvalidPasswordError} from "@/shared/types/next-auth-exceptions";

export async function actionSignIn(login: string, password: string): Promise<string|undefined> {
  try {
    return await signIn("credentials", {
      login: login,
      password: password,
      redirectTo: "/admin",
      redirect: false
    });
  }
  catch (error) {
    if (error instanceof InvalidPasswordError)
      return "InvalidPasswordError";

    if (error instanceof CouldNotParseError)
      return "CouldNotParseError";

    console.error(error);

    return "Undefined";
  }
}