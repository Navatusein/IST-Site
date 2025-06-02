"use client"

import {Card, Carousel, Image, theme} from "antd";
import {useMemo} from "react";
import {useMediaQuery} from "react-responsive";
import styles from "./component.module.scss";

interface IProps {
  width: "medium" | "large";
}

export default function Component(props: IProps) {
  const typedComponentProps = {
    type: "contact-us",
    width: props.width,
    imagePaths: [
      "/news-images/news-1.webp",
      "/news-images/news-2.webp",
      "/news-images/news-3.webp",
      "/news-images/news-4.webp",
      "/news-images/news-5.webp",
    ]
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

  const fullImagePaths = useMemo(() => (
    typedComponentProps.imagePaths.map(imagePath => `/api/assets${imagePath}`
  )), [typedComponentProps.imagePaths]);

  const isXl = useMediaQuery({minWidth: 1200})
  const isLg = useMediaQuery({minWidth: 992})

  return (
    <>
      <Carousel
        responsive={[
          {breakpoint: 1200, settings: {slidesToShow: 3}},
          {breakpoint: 992, settings: {slidesToShow: 2}},
          // {breakpoint: 1200, settings: {slidesToShow: 3}}
        ]}
        autoplay
        arrows
        centerPadding={"12px"}
      >
        {fullImagePaths.map((imagePath, index) => (
          <Card>
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
          </Card>
        ))}
      </Carousel>
    </>
  )
}