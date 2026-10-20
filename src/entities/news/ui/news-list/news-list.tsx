import {Flex} from "antd";
import NewsCard from "../news-card/news-card";
import {INews} from "../../types/type";

interface IProps {
  newsList: INews[];
}

export default function NewsList(props: IProps) {
  return (
    <Flex vertical gap="middle">
      {props.newsList.map((newsElement, index) => (
        <NewsCard news={newsElement} key={`news-${index}`}/>
      ))}
    </Flex>
  )
}
