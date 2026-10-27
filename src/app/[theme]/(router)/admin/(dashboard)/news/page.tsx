import {Metadata} from "next";
import {getNewsPageAction} from "@/entities/news/actions/actions";
import {AdminNewsCrudView} from "@/views/admin-news-crud";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import parsePageQuery from "@/shared/utilities/parse-page-query";

export const metadata: Metadata = {title: "Новини"};

interface IProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page(props: IProps) {
  const query = parsePageQuery(await props.searchParams);
  const result = await unwrapServerAction(getNewsPageAction(query));

  return (
    <AdminNewsCrudView result={result}/>
  );
}
