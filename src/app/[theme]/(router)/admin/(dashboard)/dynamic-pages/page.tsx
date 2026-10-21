import {getDynamicPagesPageAction} from "@/entities/dynamic-page/actions/actions";
import {AdminDynamicPageCrudView} from "@/views/admin-dynamic-page-crud";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import parsePageQuery from "@/shared/utilities/parse-page-query";
import {getSiteLinksAction} from "@/features/site-links";

interface IProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page(props: IProps) {
  const query = parsePageQuery(await props.searchParams);
  const [result, siteLinks] = await Promise.all([
    unwrapServerAction(getDynamicPagesPageAction(query)),
    unwrapServerAction(getSiteLinksAction())
  ]);

  return (
    <AdminDynamicPageCrudView result={result} siteLinks={siteLinks}/>
  );
}
