import {getDynamicPageByPathAction} from "@/entities/dynamic-page/actions/actions";
import {notFound} from "next/navigation";
import {AdminEditDynamicPageView} from "@/views/admin-edit-dynamic-page";
import {useServerAction} from "@/shared/hooks/use-server-action";

interface IProps {
  params: Promise<{
    path: string[];
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const page = await useServerAction(getDynamicPageByPathAction(path.join("/")));

  if (!page)
    notFound();

  return (
    <AdminEditDynamicPageView page={page}/>
  );
}
