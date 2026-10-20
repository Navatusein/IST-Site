import {Flex} from "antd";
import {IPageComponentViewProps, usePageComponentData} from "@/entities/dynamic-page/model";
import {PageLinkButton} from "@/features/page-link";
import {ButtonsData, IButtonsPageComponent} from "../../types/type";

const FLEX_ALIGN = {start: "flex-start", center: "center", end: "flex-end"} as const;

export default function Buttons(props: IPageComponentViewProps<IButtonsPageComponent, ButtonsData>) {
  const files = usePageComponentData(props.component, props.data) ?? {};

  const {layout, fullWidth, align, variant} = props.component;

  const buttons = (props.component.buttons ?? []).filter((button) => button?.title?.trim());

  return (
    <Flex
      vertical={layout == "column"}
      wrap={layout == "row"}
      gap="small"
      justify={layout == "row" && !fullWidth ? FLEX_ALIGN[align] : undefined}
      align={layout == "column" && !fullWidth ? FLEX_ALIGN[align] : undefined}
    >
      {buttons.map((button, index) => (
        <PageLinkButton
          key={`button-${index}`}
          link={button}
          file={button.linkType == "file" ? files[button.link] : undefined}
          showFileSize
          type={variant}
          block={fullWidth && layout == "column"}
          style={fullWidth && layout == "row" ? {flex: "1 1 200px"} : undefined}
        >
          {button.title}
        </PageLinkButton>
      ))}
    </Flex>
  )
}
