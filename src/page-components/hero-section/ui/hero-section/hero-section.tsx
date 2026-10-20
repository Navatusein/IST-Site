import {Flex, Image} from "antd";
import {RichTextRenderer} from "@/features/rich-text-renderer";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";
import {IHeroSectionPageComponent} from "../../types/type";
import styles from "./hero-section.module.scss";

export default function HeroSection(props: IPageComponentViewProps<IHeroSectionPageComponent>) {
  return (
    <Flex vertical className={styles.titleBaseContainer} style={{height: props.component.imageHeight}}>
      {props.component.imageSlug &&
        <Image
          src={getFileAssetUrl(props.component.imageSlug)}
          fallback="/missing-image.webp"
          preview={false}
          height={props.component.imageHeight}
          width={"100%"}
          className={styles.image}
          loading={"lazy"}
        />
      }
      <Flex vertical gap="small" className={styles.titleFlexContainer}>
        <RichTextRenderer content={props.component.title} className={styles.titleTypography}/>
      </Flex>
    </Flex>
  )
}
