import {useMemo} from "react";
import {Card, Carousel, Col, Grid, Image} from "antd";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";
import {IGalleryCarouselPageComponent} from "../../types/type";
import styles from "./gallery-carousel.module.scss";

export default function GalleryCarousel(props: IPageComponentViewProps<IGalleryCarouselPageComponent>) {
  const imageUrls = useMemo(() => (
    props.component.imageSlugs.filter(Boolean).map((imageSlug) => getFileAssetUrl(imageSlug))
  ), [props.component.imageSlugs]);

  const screens = Grid.useBreakpoint();
  const isMeasured = Object.keys(screens).length != 0;
  const slidesToShow = !isMeasured || screens.xl ? 3 : screens.lg ? 2 : 1;

  return (
    <Card variant="borderless" style={{borderRadius: 0}}>
      <Carousel
        slidesToShow={Math.min(slidesToShow, Math.max(imageUrls.length, 1))}
        autoplay={true}
        infinite={true}
        arrows={true}
        className={styles.carousel}
      >
        {imageUrls.map((imageUrl, index) => (
          <div key={`image-${index}`}>
            <Col className={styles.container}>
              <Image.PreviewGroup
                items={imageUrls}
              >
                <Image
                  className={styles.image}
                  width={"100%"}
                  src={imageUrl}
                  fallback="/missing-image.webp"
                />
              </Image.PreviewGroup>
            </Col>
          </div>
        ))}
      </Carousel>
    </Card>
  )
}
