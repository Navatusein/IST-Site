import {getPublicMenuItemsTreeAction} from "@/entities/public-menu-item/actions/actions";
import {AdminPublicMenuControlView} from "@/views/admin-public-menu-control";

export default async function Page() {
  const menuItems = await getPublicMenuItemsTreeAction();

  return (
    <AdminPublicMenuControlView menuItems={menuItems}/>
  )
}