import {Card, Col, Flex, Image} from "antd";
import {ReactNode} from "react";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";

interface IProps {
  imageSlug?: string;
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
            src={getFileAssetUrl(props.imageSlug) ?? "/missing-image.webp"}
            fallback="/missing-image.webp"
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
