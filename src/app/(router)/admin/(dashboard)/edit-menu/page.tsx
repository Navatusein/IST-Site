import {getPublicMenuItemsTreeAction} from "@/entities/public-menu-item/actions/actions";
import {AdminPublicMenuControlView} from "@/views/admin-public-menu-control";
import {useServerAction} from "@/shared/hooks/use-server-action";

export default async function Page() {
  const menuItems = await useServerAction(getPublicMenuItemsTreeAction());

  return (
    <AdminPublicMenuControlView menuItems={menuItems}/>
  )
}