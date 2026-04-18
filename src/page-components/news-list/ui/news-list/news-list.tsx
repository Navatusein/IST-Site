import {useEffect, useMemo, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import NewsListEditor from "../news-list-editor/news-list-editor";
import {INewsListPageComponent} from "../../types/type";
import {INews} from "@/entities/news";
import {getNewsCountAction, getNewsPaginationAction} from "@/entities/news/actions/actions";
import {Button, Flex, Pagination} from "antd";
import Link from "next/link";
import {NewsList as NewsListElement} from "@/widgets/news-list";
import {useServerAction} from "@/shared/hooks/use-server-action";

interface IProps {
  component: IBasePageComponent;
}

export default function NewsList(props: IProps) {
  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "news-list")
      return null;

    return props.component as INewsListPageComponent;
  }, [props]);

  const [news, setNews] = useState<INews[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (typedComponent != null) {
      const offset = (page - 1) * typedComponent.countDisplayed;

      useServerAction(getNewsPaginationAction(offset, typedComponent.countDisplayed))
        .then((data) => {
          setNews(() => data);
        });

      useServerAction(getNewsCountAction())
        .then((total) => {
          setTotal(() => total);
        });
    }
  }, [typedComponent?.countDisplayed, page]);

  const changePage = (page: number) => {
    setPage(() => page)
  }

  return (
    <PageComponentError component={typedComponent}>
      <Flex vertical gap="middle" align="center">
        <NewsListElement newsList={news}/>
        {typedComponent!.pagination ?
          <Pagination defaultCurrent={1} total={total} pageSize={typedComponent!.countDisplayed} onChange={changePage}/> :
          <Link href={"/news"}>
            <Button type="primary" block>
              Переглянути всі новини
            </Button>
          </Link>
        }
      </Flex>
    </PageComponentError>
  )
}

NewsList.Editor = NewsListEditor