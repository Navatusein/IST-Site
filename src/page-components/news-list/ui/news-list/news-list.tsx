import {useEffect, useRef, useState} from "react";
import {App, Button, Flex, Pagination} from "antd";
import Link from "next/link";
import {NewsList as NewsListElement} from "@/entities/news/ui";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {IPageComponentViewProps, usePageComponentData} from "@/entities/dynamic-page/model";
import {INewsListData, INewsListPageComponent} from "../../types/type";
import {getNewsListDataAction} from "../../actions/actions";
import {getNewsCountDisplayed} from "../../utilities/news-count";

export default function NewsList(props: IPageComponentViewProps<INewsListPageComponent, INewsListData>) {
  const {notification} = App.useApp();
  const firstPageData = usePageComponentData(props.component, props.data);
  const countDisplayed = getNewsCountDisplayed(props.component.countDisplayed);

  const [page, setPage] = useState<number>(1);
  const [pageData, setPageData] = useState<INewsListData>();
  const requestId = useRef<number>(0);

  useEffect(() => {
    requestId.current++;
    setPage(() => 1);
    setPageData(() => undefined);
  }, [props.component]);

  const changePage = (page: number) => {
    const currentRequestId = ++requestId.current;
    setPage(() => page);

    unwrapServerAction(getNewsListDataAction(countDisplayed, page))
      .then((data) => {
        if (currentRequestId == requestId.current)
          setPageData(() => data);
      })
      .catch((error: Error) => {
        if (currentRequestId == requestId.current)
          notification.error({title: "Не вдалося завантажити новини", description: error.message});
      });
  }

  const data = pageData ?? firstPageData;

  return (
    <Flex vertical gap="middle" align="center">
      <NewsListElement newsList={data?.news ?? []}/>
      {props.component.pagination ?
        <Pagination current={page} total={data?.total ?? 0} pageSize={countDisplayed} onChange={changePage}/> :
        <Link href={"/news"}>
          <Button type="primary" block>
            Переглянути всі новини
          </Button>
        </Link>
      }
    </Flex>
  )
}
