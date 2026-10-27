import {Metadata} from "next";
import DynamicPageRoute, {getDynamicPageMetadata} from "@/app/page-components/dynamic-page-route";
import {HOME_PAGE_PATH} from "@/shared/utilities/public-paths";

export const revalidate = 86400;

export function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata(HOME_PAGE_PATH);
}

export default function Page() {
  return (
    <DynamicPageRoute path={HOME_PAGE_PATH}/>
  );
}
