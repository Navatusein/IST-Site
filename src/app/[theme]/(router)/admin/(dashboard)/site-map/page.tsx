import {Metadata} from "next";
import {AdminSiteMapView} from "@/views/admin-site-map";
import {getSiteLinksAction} from "@/features/site-links";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

export const metadata: Metadata = {title: "Карта сайту"};

export default async function Page() {
  const graph = await unwrapServerAction(getSiteLinksAction());

  return (
    <AdminSiteMapView graph={graph}/>
  );
}
