"use server"

import {AdminDynamicPageControlView} from "@/views/admin-dynamic-page-control";
import {getDynamicPagesAction} from "@/entities/dynamic-page/actions/actions";
import {useServerAction} from "@/shared/hooks/use-server-action";

export default async function Page() {
  const pages = await useServerAction(getDynamicPagesAction());

  return (
    <AdminDynamicPageControlView pages={pages}/>
  );
}