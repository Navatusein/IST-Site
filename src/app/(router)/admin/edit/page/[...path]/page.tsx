import {getDynamicPageByPathAction} from "@/entities/dynamic-page/actions/actions";
import {notFound} from "next/navigation";
import {DynamicPageView} from "@/views/dynamic-page";

interface IProps {

}

interface IProps {
  params: Promise<{
    path: string[];
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const page = await getDynamicPageByPathAction(path.join("/"))

  if (!page)
    notFound();

  return (
    <DynamicPageView page={page}/>
  );
}
