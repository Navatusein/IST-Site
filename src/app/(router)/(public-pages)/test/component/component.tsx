"use client"

import {Card, theme} from "antd";
import {useMemo} from "react";
import {RichTextEditor} from "@/features/rich-text-editor";

interface IProps {
  width: "medium" | "large";
}

const content =  "{\"type\":\"doc\",\"content\":[{\"type\":\"heading\",\"attrs\":{\"level\":2},\"content\":[{\"type\":\"text\",\"text\":\"Запрошуємо до нас на навчання \"}]},{\"type\":\"heading\",\"attrs\":{\"level\":4},\"content\":[{\"type\":\"text\",\"text\":\"Кафедра інформаційних систем та технологій забезпечує навчання здобувачів за спец. F6 - \\\"Інформаційні системи та технології\\\" за такими освітніми програмами: \"}]},{\"type\":\"bulletList\",\"content\":[{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"ОПП \\\"Програмні технології інтернет речей\\\",\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"ОПП \\\"Технології веброзробки та вебдизайн\\\",\"}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"ОС \\\"Бакалавр\\\";\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"ОНП \\\"Програмні технології інтернет речей\\\",\"}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"ОС \\\"Магістр\\\";\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"ОНП \\\"Інформаційні системи та технології\\\",\"}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"ОС \\\"Доктор філософії\\\"\"}]}]}]}]}";

export default function Component(props: IProps) {
  const typedComponentProps = {
    type: "contact-us",
    width: props.width
  }

  const {token: {padding, paddingXS}} = theme.useToken();

  const config = useMemo(() => {
    switch (typedComponentProps.width) {
      case "medium":
        return {}
      case "large":
      default:
        return {}
    }
  }, [typedComponentProps.width])



  return (
    <>
      <Card>
        <RichTextEditor value={content}/>
      </Card>
    </>
  )
}