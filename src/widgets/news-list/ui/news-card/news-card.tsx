import {Button, Card, Flex, Typography, Image} from "antd";
import dayjs from "dayjs";
import {redirect} from "next/navigation";
import {INews} from "@/entities/news";
import styles from "./news-card.module.scss";

interface IProps {
  news: INews;
}

export default function NewsCard(props: IProps) {
  return (
    <Card variant="borderless">
      <Flex gap="middle" className={styles.contentFlex}>
        <Flex vertical gap="middle" className={styles.textContentFlex}>
          <Flex vertical style={{order: -1}}>
            <Typography.Title level={5} style={{margin: "0"}}>
              {props.news.title}
            </Typography.Title>
            <Typography.Text type="secondary">
              {dayjs(props.news.date).format('D MMMM YYYY, dddd').toString()}
            </Typography.Text>
          </Flex>
          <Typography.Text style={{flex: 1}}>
            {props.news.description}
          </Typography.Text>
          <Button type="primary" onClick={() => redirect(`/news/${props.news.path}`)}>
            Читати далі
          </Button>
        </Flex>
        <Flex className={styles.imageContainer}>
          <Image src={`/files/${props.news.imagePath}`} width={500} style={{objectFit: "cover"}}/>
        </Flex>
      </Flex>
    </Card>
  )
}