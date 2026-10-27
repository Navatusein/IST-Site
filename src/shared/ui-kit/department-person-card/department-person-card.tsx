import {Card, Col, Flex, Image} from "antd";
import {ReactNode} from "react";
import {getFileImageProps} from "@/shared/utilities/file-urls";

interface IProps {
  imageSlug?: string;
  name: string;
  children: ReactNode;
}

export default function DepartmentPersonCard(props: IProps) {
  return (
    <Col xs={{span: 24}} sm={{span: 12}} md={{span: 8}} xl={{span: 6}}>
      <Card
        hoverable
        variant="borderless"
        style={{height: "100%", display: "flex", flexDirection: "column"}}
        styles={{body: {height: "100%"}}}
        cover={
          <Image
            {...getFileImageProps(props.imageSlug, "(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw")}
            fallback="/missing-image.webp"
            alt={props.name}
            preview={false}
            height={350}
            style={{objectFit: "cover", borderRadius: " 8px 8px 0 0", aspectRatio: "3 \ 4", filter: "grayscale(100%)"}}
          />
        }
      >
        <Flex vertical style={{height: "100%"}} gap="middle" justify="space-between">
          {props.children}
        </Flex>
      </Card>
    </Col>
  )
}
