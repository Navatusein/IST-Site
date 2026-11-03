import {useMemo} from "react";
import {Card, Carousel, Col, Image} from "antd";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {getFileAssetUrl, getFileImageProps} from "@/shared/utilities/file-urls";
import {useMediaQuery} from "@/shared/hooks/use-media-query";
import {IGalleryCarouselPageComponent} from "../../types/type";
import styles from "./gallery-carousel.module.scss";

export default function GalleryCarousel(props: IPageComponentViewProps<IGalleryCarouselPageComponent>) {
  const imageUrls = useMemo(() => (
    props.component.imageSlugs.filter(Boolean).map((imageSlug) => getFileAssetUrl(imageSlug))
  ), [props.component.imageSlugs]);

  const imageSlugs = props.component.imageSlugs.filter(Boolean);

  const slidesCount = Math.max(imageUrls.length, 1);

  // react-slick's `responsive` keeps the server's slide widths after hydration, so remount on a count change instead
  const isWide = useMediaQuery("(min-width: 1200px)");
  const isMedium = useMediaQuery("(min-width: 992px)");
  const slidesToShow = Math.min(isWide ? 3 : isMedium ? 2 : 1, slidesCount);

  return (
    <Card variant="borderless" style={{borderRadius: 0}}>
      <Carousel
        key={slidesToShow}
        slidesToShow={slidesToShow}
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
