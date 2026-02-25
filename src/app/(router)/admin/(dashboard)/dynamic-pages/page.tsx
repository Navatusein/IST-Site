"use server"

import {AdminDynamicPageCrudView} from "@/views/admin-dynamic-page-crud";
import {getDynamicPagesAction} from "@/entities/dynamic-page/actions/actions";
import {useServerAction} from "@/shared/hooks/use-server-action";

export default async function Page() {
  const pages = await useServerAction(getDynamicPagesAction());

  return (
    <AdminDynamicPageCrudView pages={pages}/>
  );
}