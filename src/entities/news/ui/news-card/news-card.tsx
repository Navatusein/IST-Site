import {Button, Card, Flex, Typography, Image} from "antd";
import formatDate from "@/shared/utilities/format-date";
import {INews} from "../../types/type";
import styles from "./news-card.module.scss";
import Link from "next/link";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";

interface IProps {
  news: INews;
}

export default function NewsCard(props: IProps) {
  return (
    <Card variant="borderless">
      <Flex gap="middle" className={styles.contentFlex}>
        <Flex vertical gap="middle" className={styles.textFlexContainer}>
          <Flex vertical className={styles.titleFlexContainer}>
            <Typography.Title level={5} className={styles.titleTypography}>
              {props.news.title}
            </Typography.Title>
            <Typography.Text type="secondary">
              {formatDate(props.news.date)}
            </Typography.Text>
          </Flex>
          <Typography.Text className={styles.textTypography}>
            {props.news.description}
          </Typography.Text>
          <Link href={`/news/${props.news.path}`}>
            <Button type="primary" block>
              Читати далі
            </Button>
          </Link>
        </Flex>
        <Flex className={styles.imageContainer}>
          <Image
            src={getFileAssetUrl(props.news.imageSlug) ?? "/missing-image.webp"}
            width={"100%"}
            className={styles.image}
            loading="lazy"
          />
        </Flex>
      </Flex>
    </Card>
  )
}