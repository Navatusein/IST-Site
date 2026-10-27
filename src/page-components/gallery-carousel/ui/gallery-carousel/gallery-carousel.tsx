import {useMemo} from "react";
import {Card, Carousel, Col, Image} from "antd";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {getFileAssetUrl, getFileImageProps} from "@/shared/utilities/file-urls";
import {IGalleryCarouselPageComponent} from "../../types/type";
import styles from "./gallery-carousel.module.scss";

export default function GalleryCarousel(props: IPageComponentViewProps<IGalleryCarouselPageComponent>) {
  const imageUrls = useMemo(() => (
    props.component.imageSlugs.filter(Boolean).map((imageSlug) => getFileAssetUrl(imageSlug))
  ), [props.component.imageSlugs]);

  const imageSlugs = props.component.imageSlugs.filter(Boolean);

  const slidesCount = Math.max(imageUrls.length, 1);

  return (
    <Card variant="borderless" style={{borderRadius: 0}}>
      <Carousel
        slidesToShow={Math.min(3, slidesCount)}
        responsive={[
          {breakpoint: 1199, settings: {slidesToShow: Math.min(2, slidesCount)}},
          {breakpoint: 991, settings: {slidesToShow: 1}},
        ]}
        autoplay={true}
        infinite={true}
        arrows={true}
        className={styles.carousel}
      >
        {imageSlugs.map((imageSlug, index) => (
          <div key={`image-${index}`}>
            <Col className={styles.container}>
              <Image.PreviewGroup
                items={imageUrls}
              >
                <Image
                  className={styles.image}
                  width={"100%"}
                  {...getFileImageProps(imageSlug, "(max-width: 991px) 100vw, (max-width: 1199px) 50vw, 33vw")}
                  fallback="/missing-image.webp"
                  alt=""
                />
              </Image.PreviewGroup>
            </Col>
          </div>
        ))}
      </Carousel>
    </Card>
  )
}
