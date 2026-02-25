import {getPublicMenuItemsTreeAction} from "@/entities/public-menu-item/actions/actions";
import {AdminPublicMenuCrudView} from "@/views/admin-public-menu-crud";
import {useServerAction} from "@/shared/hooks/use-server-action";

export default async function Page() {
  const menuItems = await useServerAction(getPublicMenuItemsTreeAction());

  return (
    <AdminPublicMenuCrudView menuItems={menuItems}/>
  )
}