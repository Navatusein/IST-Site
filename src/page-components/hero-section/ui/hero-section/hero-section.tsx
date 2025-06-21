import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import HeroSectionEditor from "../hero-section-editor/hero-section-editor";
import {IHeroSectionPageComponent} from "../../types/type";
import {Flex, Image, Typography} from "antd";
import styles from "./hero-section.module.scss";
import {RichTextRenderer} from "@/features/rich-text-renderer";

interface IProps {
  componentProps: IBasePageComponent;
}

export default function HeroSection(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "hero-section")
      return null;

    return props.componentProps as IHeroSectionPageComponent;
  }, [props]);

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Flex vertical className={styles.titleBaseContainer} style={{height: typedComponentProps!.imageHeight}}>
        {typedComponentProps!.imagePath &&
          <Image
            src={`/api/assets${typedComponentProps!.imagePath}`}
            fallback="/missing-image.webp"
            preview={false}
            height={typedComponentProps!.imageHeight}
            width={"100%"}
            className={styles.image}
            loading={"lazy"}
          />
        }
        <Flex vertical gap="small" className={styles.titleFlexContainer}>
          <RichTextRenderer content={typedComponentProps!.title} className={styles.titleTypography}/>
        </Flex>
      </Flex>
    </PageComponentError>
  )
}

HeroSection.Editor = HeroSectionEditor