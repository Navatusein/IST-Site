import {Metadata} from "next";
import {getPublicMenuTreePageAction} from "@/entities/public-menu-item/actions/actions";
import {AdminPublicMenuCrudView} from "@/views/admin-public-menu-crud";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import parsePageQuery from "@/shared/utilities/parse-page-query";
import {getPublicMenuItemsTreeAction} from "@/entities/public-menu-item/actions/actions";

export const metadata: Metadata = {title: "Навігаційне меню"};

interface IProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page(props: IProps) {
  const query = parsePageQuery(await props.searchParams);
  const result = await unwrapServerAction(getPublicMenuTreePageAction(query));
  const menuItems = await unwrapServerAction(getPublicMenuItemsTreeAction());

  return (
    <AdminPublicMenuCrudView result={result} menuItems={menuItems}/>
  );
}
