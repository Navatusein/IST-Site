import {AdminNewsCrudView} from "@/views/admin-news-crud";
import {getNewsAction} from "@/entities/news/actions/actions";
import {useServerAction} from "@/shared/hooks/use-server-action";

export default async function Page() {
  const news = await useServerAction(getNewsAction());

  return (
    <>
      <AdminNewsCrudView news={news}/>
    </>
  )
}