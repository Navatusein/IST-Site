"use server"

import {DynamicPageModel, IDynamicPage} from "@/entities/dynamic-page";
import {notFound} from "next/navigation";
import {DynamicPageView} from "@/views/dynamic-page";

interface IProps {
  params: Promise<{
    path: string[];
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const page = await DynamicPageModel.findOne<IDynamicPage>({path: path.join("/")})

  if (!page)
    notFound();

  return (
    <DynamicPageView page={page}/>
  );
}