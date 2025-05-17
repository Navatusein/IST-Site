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

interface IProps {
  componentProps: IBasePageComponent;
}

export default function NewsList(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "news-list")
      return null;

    return props.componentProps as INewsListPageComponent;
  }, [props]);

  const [news, setNews] = useState<INews[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (typedComponentProps != null) {
      const offset = (page - 1) * typedComponentProps.countDisplayed;

      getNewsPaginationAction(offset, typedComponentProps.countDisplayed).then((data) => {
        setNews(() => data);
      });

      getNewsCountAction().then((total) => {
        setTotal(() => total);
      });
    }
  }, [typedComponentProps?.countDisplayed, page]);

  const changePage = (page: number) => {
    setPage(() => page)
  }

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Flex vertical gap="middle" align="center">
        <NewsListElement newsList={news}/>
        {typedComponentProps!.pagination ?
          <Pagination defaultCurrent={1} total={total} pageSize={typedComponentProps!.countDisplayed} onChange={changePage}/> :
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