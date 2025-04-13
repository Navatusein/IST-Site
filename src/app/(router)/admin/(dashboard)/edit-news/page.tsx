import {AdminNewsControlView} from "@/views/admin-news-control";
import {getNewsAction} from "@/entities/news/actions/actions";

export default async function Page() {
  const news = await getNewsAction();

  return (
    <>
      <AdminNewsControlView news={news}/>
    </>
  )
}