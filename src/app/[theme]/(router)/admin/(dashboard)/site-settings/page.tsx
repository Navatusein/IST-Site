import {Metadata} from "next";
import {AdminSiteSettingsView} from "@/views/admin-site-settings";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

export const metadata: Metadata = {title: "Налаштування сайту"};

export default async function Page() {
  const settings = await unwrapServerAction(getSiteSettingsAction());

  return (
    <AdminSiteSettingsView settings={settings}/>
  );
}
