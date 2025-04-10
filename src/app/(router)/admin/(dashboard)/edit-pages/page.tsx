"use server"

import {AdminDynamicPageControlView} from "@/views/admin-dynamic-page-control";
import {getDynamicPagesAction} from "@/entities/dynamic-page/actions/actions";

export default async function Page() {
  const pages = await getDynamicPagesAction();

  return (
    <AdminDynamicPageControlView pages={pages}/>
  );
}