"use client"

import {Button, Card, Col, Flex, Image, theme, Typography} from "antd";
import {useEffect, useState} from "react";
import {INews} from "@/entities/news";
import {getNewsAction, getNewsSortAction} from "@/entities/news/actions/actions";
import dayjs from "dayjs";
import Link from "next/link";
import {redirect} from "next/navigation";


const typedComponentProps = {
  countDisplayedNews: 5,
}

export default function Component() {
  const {token: {colorTextLightSolid, colorPrimary, colorSuccess}} = theme.useToken();

  const [news, setNews] = useState<INews[]>([]);

  useEffect(() => {
    getNewsSortAction(0, typedComponentProps.countDisplayedNews)
      .then((data) => {
        setNews(() => data);
      })
  }, [typedComponentProps]);

  return (
    <Flex vertical gap="middle" style={{marginTop: 16}}>
      {news.map((newsElement, index) => (
        <Col key={`news-${index}`} span={10} offset={7}>
          <Card variant="borderless">
            <Flex align="center" gap="middle">
              <Flex vertical gap="middle" style={{flex: 1}}>
                <Flex vertical>
                  <Typography.Title level={5} style={{margin: "0"}}>
                    {newsElement.title}
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    {dayjs(newsElement.date).format('D MMMM YYYY, dddd').toString()}
                  </Typography.Text>
                </Flex>
                <Typography.Text style={{flex: 1}}>
                  {newsElement.description}
                </Typography.Text>
                <Button onClick={() => redirect(`news/${newsElement.path}`)}>
                  Читати далі
                </Button>
              </Flex>
              <Image width={300} src={`files/${newsElement.imagePath}`}/>
            </Flex>
          </Card>
        </Col>
      ))}
    </Flex>
  )
}