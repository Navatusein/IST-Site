import {useEffect, useState} from "react";
import {Button, Flex, Pagination} from "antd";
import Link from "next/link";
import {NewsList as NewsListElement} from "@/entities/news/ui";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {IPageComponentViewProps, usePageComponentData} from "@/entities/dynamic-page/model";
import {INewsListData, INewsListPageComponent} from "../../types/type";
import {getNewsListDataAction} from "../../actions/actions";

export default function NewsList(props: IPageComponentViewProps<INewsListPageComponent, INewsListData>) {
  const firstPageData = usePageComponentData(props.component, props.data);

  const [page, setPage] = useState<number>(1);
  const [pageData, setPageData] = useState<INewsListData>();

  useEffect(() => {
    setPage(() => 1);
    setPageData(() => undefined);
  }, [props.component]);

  const changePage = (page: number) => {
    setPage(() => page);

    unwrapServerAction(getNewsListDataAction(props.component.countDisplayed, page))
      .then((data) => {
        setPageData(() => data);
      });
  }

  const data = pageData ?? firstPageData;

  return (
    <Flex vertical gap="middle" align="center">
      <NewsListElement newsList={data?.news ?? []}/>
      {props.component.pagination ?
        <Pagination current={page} total={data?.total ?? 0} pageSize={props.component.countDisplayed} onChange={changePage}/> :
        <Link href={"/news"}>
          <Button type="primary" block>
            Переглянути всі новини
          </Button>
        </Link>
      }
    </Flex>
  )
}
