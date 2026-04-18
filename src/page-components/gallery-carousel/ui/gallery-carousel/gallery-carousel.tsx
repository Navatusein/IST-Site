import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import GalleryCarouselEditor from "../gallery-carousel-editor/gallery-carousel-editor";
import {IGalleryCarouselPageComponent} from "../../types/type";
import {Card, Carousel, Col, Image} from "antd";
import styles from "./gallery-carousel.module.scss";

interface IProps {
  component: IBasePageComponent;
}

export default function GalleryCarousel(props: IProps) {
  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "gallery-carousel")
      return null;

    return props.component as IGalleryCarouselPageComponent;
  }, [props]);

  const fullImagePaths = useMemo(() => (
    typedComponent?.imagePaths.map(imagePath => `/api/assets${imagePath}`) ?? []
  ), [typedComponent?.imagePaths]);

  return (
    <PageComponentError component={typedComponent}>
      <Card variant="borderless" style={{borderRadius: 0}}>
        <Carousel
          slidesToShow={3}
          autoplay={true}
          infinite={true}
          arrows={true}
          className={styles.carousel}
          responsive={[
            {breakpoint: 1200, settings: {slidesToShow: 2}},
            {breakpoint: 992, settings: {slidesToShow: 1}},
          ]}
        >
          {fullImagePaths.map((imagePath) => (
            <div>
              <Col className={styles.container}>
                <Image.PreviewGroup
                  items={fullImagePaths}
                >
                  <Image
                    key={`image-${imagePath}`}
                    className={styles.image}
                    width={"100%"}
                    src={imagePath}
                    fallback="/missing-image.webp"
                  />
                </Image.PreviewGroup>
              </Col>
            </div>
          ))}
        </Carousel>
      </Card>
    </PageComponentError>
  )
}

GalleryCarousel.Editor = GalleryCarouselEditor