import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import HeroSectionEditor from "../hero-section-editor/hero-section-editor";
import {IHeroSectionPageComponent} from "../../types/type";
import {Flex, Image} from "antd";
import styles from "./hero-section.module.scss";
import {RichTextRenderer} from "@/features/rich-text-renderer";

interface IProps {
  component: IBasePageComponent;
}

export default function HeroSection(props: IProps) {
  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "hero-section")
      return null;

    return props.component as IHeroSectionPageComponent;
  }, [props]);

  return (
    <PageComponentError component={typedComponent}>
      <Flex vertical className={styles.titleBaseContainer} style={{height: typedComponent!.imageHeight}}>
        {typedComponent!.imagePath &&
          <Image
            src={`/api/assets${typedComponent!.imagePath}`}
            fallback="/missing-image.webp"
            preview={false}
            height={typedComponent!.imageHeight}
            width={"100%"}
            className={styles.image}
            loading={"lazy"}
          />
        }
        <Flex vertical gap="small" className={styles.titleFlexContainer}>
          <RichTextRenderer content={typedComponent!.title} className={styles.titleTypography}/>
        </Flex>
      </Flex>
    </PageComponentError>
  )
}

HeroSection.Editor = HeroSectionEditor