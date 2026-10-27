import {Metadata} from "next";
import {getDynamicPageByPathAction} from "@/entities/dynamic-page/actions/actions";
import {notFound} from "next/navigation";
import {AdminDynamicPageEditView} from "@/views/admin-dynamic-page-edit";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

interface IProps {
  params: Promise<{
    path: string[];
  }>
}

export async function generateMetadata(props: IProps): Promise<Metadata> {
  const {path} = await props.params;

  const page = await unwrapServerAction(getDynamicPageByPathAction(path.join("/"))).catch(() => null);

  return {title: page ? `Редагування: ${page.name}` : "Редагування"};
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
