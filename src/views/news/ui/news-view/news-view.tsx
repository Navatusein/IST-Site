"use client"

import {INews} from "@/entities/news";
import dynamic from "next/dynamic";
import {ComponentCol, Loader} from "@/shared/ui-kit";
import {Button, Flex, Image, theme, Typography} from "antd";
import dayjs from "dayjs";
import Link from "next/link";

interface IProps {
  news: INews;
}

const DynamicPageRenderer = dynamic(() => import("@/widgets/dynamic-page-renderer").then(x => x.DynamicPageRenderer), {
  ssr: false,
  loading: () => <Loader/>
});


export default function NewsView(props: IProps) {
  const {token: {borderRadius, padding}} = theme.useToken();

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding}}>
      <ComponentCol width="small">
        <Flex vertical style={{margin: `${padding}px 0`}}>
          <Typography.Title level={3} style={{margin: 0}}>
            {props.news.title}
          </Typography.Title>
          <Typography.Text type="secondary">
            {dayjs(props.news.date).format("D MMMM YYYY, dddd").toString()}
          </Typography.Text>
        </Flex>
        <Image
          width={"100%"}
          style={{height: "300px", objectFit: "cover", borderRadius: borderRadius}}
          src={`/api/assets/${props.news.imagePath}`}
          fallback="/missing-image.webp"
        />
      </ComponentCol>
      <DynamicPageRenderer entities={props.news.entities}/>
      <Flex justify="center">
        <Link href={"/news"}>
          <Button type="primary">
            Повернутись до новин
          </Button>
        </Link>
      </Flex>
    </Flex>
  )
}
