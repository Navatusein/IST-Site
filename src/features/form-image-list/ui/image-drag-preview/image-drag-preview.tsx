import {Card, Flex, Image, Typography} from "antd";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";

interface IProps {
  imageSlug?: string | null;
  title: string;
}

export default function ImageDragPreview(props: IProps) {
  return (
    <Card size="small" style={{width: 240}}>
      <Flex gap="small" align="center">
        {props.imageSlug && (
          <Image
            src={getFileAssetUrl(props.imageSlug)}
            width={40}
            height={40}
            preview={false}
            style={{objectFit: "cover", borderRadius: 4}}
          />
        )}
        <Typography.Text ellipsis>
          {props.title}
        </Typography.Text>
      </Flex>
    </Card>
  )
}
