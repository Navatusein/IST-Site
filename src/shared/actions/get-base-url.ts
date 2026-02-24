"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";

export const getBaseUrl = createServerAction<string>(() => {
  return Promise.resolve(process.env.APP_PUBLIC_URL);
});
