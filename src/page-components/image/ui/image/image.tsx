import {Flex, Image as AntImage, theme, Typography} from "antd";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";
import {IImagePageComponent} from "../../types/type";

export default function Image(props: IPageComponentViewProps<IImagePageComponent>) {
  const {token: {borderRadiusLG}} = theme.useToken();

  const isCropped = props.component.aspectRatio != "original";

  return (
    <Flex vertical gap="small">
      <AntImage
        src={getFileAssetUrl(props.component.imageSlug) ?? "/missing-image.webp"}
        fallback="/missing-image.webp"
        alt={props.component.caption}
        width="100%"
        loading="lazy"
        preview={props.component.imageSlug != null}
        style={{
          borderRadius: borderRadiusLG,
          aspectRatio: isCropped ? props.component.aspectRatio : undefined,
          objectFit: isCropped ? "cover" : undefined
        }}
      />
      {props.component.caption && (
        <Typography.Text type="secondary" style={{textAlign: "center"}}>
          {props.component.caption}
        </Typography.Text>
      )}
    </Flex>
  )
}
