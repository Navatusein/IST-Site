"use server"

import {signIn} from "@/auth";

export async function actionSignIn(login: string, password: string) {
  return await signIn("credentials", {
    login: login,
    password: password,
    redirectTo: "/admin"
  })
}