"use server"

import {AdminDynamicPageControlView} from "@/views/admin-dynamic-page-control";
import {getDynamicPagesAction} from "@/entities/dynamic-page/actions/actions";
import toPlainObject from "@/shared/utilities/to-plain-object";

export default async function Page() {
  const pages = toPlainObject(await getDynamicPagesAction());

  return (
    <AdminDynamicPageControlView pages={pages}/>
  );
}