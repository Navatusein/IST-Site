"use server"

import {CustomPageModel, ICustomPage} from "@/entities/custom-page";
import {notFound} from "next/navigation";
import {DynamicPageView} from "@/views/dynamic-page";

interface IProps {
  params: Promise<{
    path: string[];
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const page = await CustomPageModel.findOne<ICustomPage>({path: path.join("/")})

  if (!page)
    notFound();

  return (
    <DynamicPageView page={page}/>
  );
}