"use client"

import {INews} from "@/entities/news";
import {ComponentCol} from "@/shared/ui-kit";
import {DynamicPageRenderer} from "@/widgets/dynamic-page-renderer";
import {Button, Flex, Image, theme, Typography} from "antd";
import formatDate from "@/shared/utilities/format-date";
import Link from "next/link";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";
import type {PageComponentsData} from "@/entities/dynamic-page/model";

interface IProps {
  news: INews;
  componentsData?: PageComponentsData;
}

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
            {formatDate(props.news.date)}
          </Typography.Text>
        </Flex>
        <Image
          width={"100%"}
          style={{height: "300px", objectFit: "cover", borderRadius: borderRadius}}
          src={getFileAssetUrl(props.news.imageSlug) ?? "/missing-image.webp"}
          fallback="/missing-image.webp"
        />
      </ComponentCol>
      <DynamicPageRenderer entities={props.news.entities} componentsData={props.componentsData}/>
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
