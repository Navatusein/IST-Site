import {JsonLd} from "@/shared/ui-kit";
import {getBreadcrumbs} from "./breadcrumbs";
import {breadcrumbsStructuredData} from "./structured-data";

interface IProps {
  path: string;
  title: string;
}

// Only the BreadcrumbList for search engines, nothing is shown on the page
export default async function BreadcrumbsSection(props: IProps) {
  const breadcrumbs = await getBreadcrumbs(props.path, props.title);

  if (breadcrumbs.length == 0)
    return null;

  return (
    <JsonLd data={breadcrumbsStructuredData(breadcrumbs, props.path)}/>
  );
}
