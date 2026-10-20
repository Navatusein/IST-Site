import {getUsersPageAction} from "@/entities/user/actions/actions";
import {AdminUsersCrudView} from "@/views/admin-users-crud";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import parsePageQuery from "@/shared/utilities/parse-page-query";

interface IProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page(props: IProps) {
  const query = parsePageQuery(await props.searchParams);
  const result = await unwrapServerAction(getUsersPageAction(query));

  return (
    <AdminUsersCrudView result={result}/>
  );
}
