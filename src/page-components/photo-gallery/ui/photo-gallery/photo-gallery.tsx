import {useMemo} from "react";
import {Empty, Flex, Image, Masonry, theme, Typography} from "antd";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";
import {IPhotoGalleryPageComponent, IPhotoGalleryPhoto} from "../../types/type";

export default function PhotoGallery(props: IPageComponentViewProps<IPhotoGalleryPageComponent>) {
  const {token: {paddingXS, borderRadiusLG}} = theme.useToken();

  const items = useMemo(() => (
    props.component.photos
      .filter((photo) => photo?.imageSlug)
      .map((photo, index) => ({key: `${index}-${photo.imageSlug}`, data: photo}))
  ), [props.component.photos]);

  const columns = props.component.columns;

  if (items.length == 0)
    return <Empty description="Фото не додано"/>;

  return (
    <Image.PreviewGroup>
      <Masonry<IPhotoGalleryPhoto>
        columns={{xs: 1, sm: 2, md: Math.min(columns, 3), lg: columns}}
        gutter={paddingXS}
        items={items}
        itemRender={({data}) => (
          <Flex vertical gap={4}>
            <Image
              src={getFileAssetUrl(data.imageSlug)}
              fallback="/missing-image.webp"
              alt={data.caption}
              width="100%"
              loading="lazy"
              style={{borderRadius: borderRadiusLG, display: "block"}}
            />
            {data.caption && (
              <Typography.Text type="secondary" style={{fontSize: 12}}>
                {data.caption}
              </Typography.Text>
            )}
          </Flex>
        )}
      />
    </Image.PreviewGroup>
  )
}
