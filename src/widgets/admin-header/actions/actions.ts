"use server"

import {signOut} from "@/auth";

export async function actionSignOut() {
  return await signOut({
    redirectTo: "/home"
  })
}