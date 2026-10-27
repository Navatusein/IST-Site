import {Flex, Image} from "antd";
import {RichTextRenderer} from "@/features/rich-text-renderer";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {getFileImageProps} from "@/shared/utilities/file-urls";
import {IHeroSectionPageComponent} from "../../types/type";
import styles from "./hero-section.module.scss";

export default function HeroSection(props: IPageComponentViewProps<IHeroSectionPageComponent>) {
  return (
    <Flex vertical className={styles.titleBaseContainer} style={{height: props.component.imageHeight}}>
      {props.component.imageSlug &&
        <Image
          {...getFileImageProps(props.component.imageSlug, "100vw")}
          fallback="/missing-image.webp"
          alt=""
          preview={false}
          height={props.component.imageHeight}
          width={"100%"}
          className={styles.image}
        />
      }
      <Flex vertical gap="small" className={styles.titleFlexContainer}>
        <RichTextRenderer content={props.component.title} className={styles.titleTypography}/>
      </Flex>
    </Flex>
  )
}
