import {getDynamicPageByPathAction} from "@/entities/dynamic-page/actions/actions";
import {notFound} from "next/navigation";
import {AdminDynamicPageEditView} from "@/views/admin-dynamic-page-edit";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

interface IProps {
  params: Promise<{
    path: string[];
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const page = await unwrapServerAction(getDynamicPageByPathAction(path.join("/")));

  if (!page)
    notFound();

  return (
    <AdminDynamicPageEditView page={page}/>
  );
}
